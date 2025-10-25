import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property, Booking, PaymentStatus, UserRole, BookingStatus } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { createBooking } from '../../services/firestoreService';
import { ROUTES } from '../../constants';

interface BookingWidgetProps {
  property: Property;
}

const GUEST_SERVICE_FEE_RATE = 0.05; // 5%
const GST_RATE = 0.18; // 18%

const BookingWidget: React.FC<BookingWidgetProps> = ({ property }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const today = new Date().toISOString().split('T')[0];
  
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset checkout date if checkin date is changed to be after it
  useEffect(() => {
    if (checkIn && checkOut && checkIn > checkOut) {
      setCheckOut('');
    }
  }, [checkIn, checkOut]);
  
  const totalGuests = adults + children;

  const priceDetails = useMemo(() => {
    if (!checkIn || !checkOut) {
      return null;
    }
    
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

    if (nights <= 0) return null;

    const subtotal = property.pricing.basePrice * nights;
    const cleaningFee = property.pricing.cleaningFee;
    const platformFee = subtotal * GUEST_SERVICE_FEE_RATE;
    const gst = platformFee * GST_RATE;
    const total = subtotal + cleaningFee + platformFee + gst;

    return { nights, subtotal, cleaningFee, platformFee, gst, total };
  }, [checkIn, checkOut, property.pricing]);

  const handleReserve = async () => {
    setError('');
    
    // Validations
    if (!currentUser) {
        setError("You must be logged in to book.");
        return;
    }
    if (!checkIn || !checkOut) {
        setError("Please select check-in and check-out dates.");
        return;
    }
    if (totalGuests > property.capacity.maxGuests) {
        setError(`This property can only accommodate up to ${property.capacity.maxGuests} guests.`);
        return;
    }
    if (!priceDetails) {
        setError("Invalid date range selected.");
        return;
    }

    setIsSubmitting(true);
    
    const newBooking: Omit<Booking, 'bookingId' | 'createdAt' | 'updatedAt'> = {
        propertyId: property.propertyId,
        propertyTitle: property.title,
        propertyImage: property.images[0]?.url || '',
        guestId: currentUser.uid,
        hostId: property.hostId,
        checkIn,
        checkOut,
        guests: { adults, children, infants },
        pricing: {
            nights: priceDetails.nights,
            subtotal: priceDetails.subtotal,
            cleaningFee: priceDetails.cleaningFee,
            platformFee: priceDetails.platformFee,
            gst: priceDetails.gst,
            total: priceDetails.total,
        },
        payment: {
            amount: priceDetails.total,
            currency: 'INR',
            status: PaymentStatus.PENDING,
        },
        // This would be CONFIRMED for instant book properties
        bookingStatus: BookingStatus.PENDING_CONFIRMATION, 
    };

    try {
        const newBookingId = await createBooking(newBooking);
        // Redirect to a confirmation or payment page
        navigate(ROUTES.BOOKING_CONFIRMATION.replace(':bookingId', newBookingId));
    } catch (err) {
        console.error("Booking failed:", err);
        setError("Could not create booking. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const commonInputClasses = "mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm";

  return (
    <div className="sticky top-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        ₹{property.pricing.basePrice.toLocaleString('en-IN')}
        <span className="text-base font-normal text-gray-500 dark:text-gray-400"> / night</span>
      </h2>

      <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
        {/* Date Pickers */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="checkin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Check-in</label>
            <input type="date" id="checkin" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className={commonInputClasses} min={today} />
          </div>
          <div>
            <label htmlFor="checkout" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Check-out</label>
            <input type="date" id="checkout" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className={commonInputClasses} min={checkIn || today} />
          </div>
        </div>
        
        {/* Guest Selector */}
        <div className="mt-4">
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Guests</label>
           <div className="grid grid-cols-3 gap-2 mt-1">
                <div>
                  <label htmlFor="adults" className="block text-xs font-medium text-gray-500 dark:text-gray-400">Adults</label>
                  <input type="number" id="adults" value={adults} onChange={e => setAdults(parseInt(e.target.value))} className={commonInputClasses} min="1" max="16" />
                </div>
                 <div>
                  <label htmlFor="children" className="block text-xs font-medium text-gray-500 dark:text-gray-400">Children</label>
                  <input type="number" id="children" value={children} onChange={e => setChildren(parseInt(e.target.value))} className={commonInputClasses} min="0" max="10" />
                </div>
                 <div>
                  <label htmlFor="infants" className="block text-xs font-medium text-gray-500 dark:text-gray-400">Infants</label>
                  <input type="number" id="infants" value={infants} onChange={e => setInfants(parseInt(e.target.value))} className={commonInputClasses} min="0" max="5" />
                </div>
           </div>
        </div>

        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
        
        <button
          onClick={handleReserve}
          disabled={isSubmitting || !priceDetails}
          className="mt-6 w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-75 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Reserving...' : 'Reserve'}
        </button>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">You won't be charged yet</p>
      </div>

      {priceDetails && (
        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">₹{property.pricing.basePrice.toLocaleString('en-IN')} x {priceDetails.nights} nights</span>
            <span className="text-gray-800 dark:text-gray-200">₹{priceDetails.subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Cleaning fee</span>
            <span className="text-gray-800 dark:text-gray-200">₹{priceDetails.cleaningFee.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">StaySphere service fee</span>
            <span className="text-gray-800 dark:text-gray-200">₹{priceDetails.platformFee.toLocaleString('en-IN')}</span>
          </div>
           <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">GST on service fee</span>
            <span className="text-gray-800 dark:text-gray-200">₹{priceDetails.gst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between font-bold text-base border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-gray-900 dark:text-white">₹{priceDetails.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default BookingWidget;
