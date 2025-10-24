
import React from 'react';

const FirebaseConfigNotice: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-gray-800 dark:text-gray-200">
        <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-primary-500 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <h1 className="text-3xl font-bold mb-2">Configuration Required</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
                Welcome to StaySphere AI! To get started, you need to connect the app to your Firebase project.
            </p>
        </div>

        <div className="my-8 border-t border-gray-200 dark:border-gray-700"></div>

        <div>
            <h2 className="text-xl font-semibold mb-4">Follow these steps:</h2>
            <ol className="list-decimal list-inside space-y-4 text-gray-700 dark:text-gray-300">
                <li>
                    Open the file <code className="bg-gray-200 dark:bg-gray-700 rounded-md px-2 py-1 font-mono text-sm">services/firebase.ts</code> in your code editor.
                </li>
                <li>
                    In that file, find the <code className="bg-gray-200 dark:bg-gray-700 rounded-md px-2 py-1 font-mono text-sm">firebaseConfig</code> object.
                </li>
                <li>
                    Replace the placeholder values (like <code className="bg-gray-200 dark:bg-gray-700 rounded-md px-2 py-1 font-mono text-sm">"PASTE_YOUR_..."</code>) with your actual credentials from the Firebase Console.
                </li>
            </ol>
        </div>

        <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-500/30 rounded-lg">
            <h3 className="font-semibold text-primary-800 dark:text-primary-200">Where to find your credentials?</h3>
            <p className="text-sm text-primary-700 dark:text-primary-300 mt-1">
                In your Firebase project, go to <span className="font-semibold">Project Settings</span> (click the gear icon), then under the "General" tab, scroll down to "Your apps". Click on the "Web" app (`{/* FIX: Escaped </> to prevent JSX parsing error */'</>'}`) and find the configuration snippet.
            </p>
        </div>

        <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
            The application will automatically reload once you save the changes in <code className="font-mono">services/firebase.ts</code>.
        </p>
      </div>
    </div>
  );
};

export default FirebaseConfigNotice;
