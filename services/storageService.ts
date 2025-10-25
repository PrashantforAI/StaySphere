
import { storage } from './firebase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a file to a specified path in Firebase Storage.
 * 
 * @param file The file object to upload.
 * @param path The destination path in the storage bucket (e.g., 'property-images').
 * @returns A promise that resolves with the public download URL of the uploaded file.
 */
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    // Create a unique filename to avoid collisions
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const storageRef = storage.ref(`${path}/${fileName}`);
    
    // Upload the file
    const uploadTask = await storageRef.put(file);
    
    // Get the public URL
    const downloadURL = await uploadTask.ref.getDownloadURL();
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file to Firebase Storage:", error);
    throw new Error("Image upload failed. Please try again.");
  }
};
