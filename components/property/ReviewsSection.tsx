import React from 'react';
import { Review } from '../../types';

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
}

const StarIcon = ({ className = "w-5 h-5" }: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${className} text-yellow-400`}><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" /></svg>;


const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center mb-2">
            <img src={review.guestImage} alt={review.guestName} className="w-10 h-10 rounded-full object-cover" />
            <div className="ml-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{review.guestName}</p>
                <div className="flex items-center">
                    {[...Array(review.rating)].map((_, i) => <StarIcon key={i} className="w-4 h-4" />)}
                </div>
            </div>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300">{review.comment}</p>
    </div>
);


const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, averageRating }) => {
  return (
    <div>
        <div className="flex items-center mb-4">
            <StarIcon />
            <h2 className="text-2xl font-bold ml-2 text-gray-900 dark:text-white">
                {averageRating.toFixed(1)} · {reviews.length} reviews
            </h2>
        </div>
        {reviews.length > 0 ? (
            <div className="space-y-4">
                {reviews.slice(0, 4).map(review => (
                    <ReviewCard key={review.reviewId} review={review} />
                ))}
            </div>
        ) : (
            <p className="text-gray-500 dark:text-gray-400">No reviews for this property yet.</p>
        )}
    </div>
  );
};

export default ReviewsSection;
