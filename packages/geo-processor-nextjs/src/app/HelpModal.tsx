import React from 'react';

interface HelpModalProps {
  onClose: () => void;
}

export default function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">How to Use</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500 text-left mb-4">
              This application allows you to process geographic points to calculate their centroid and bounding box. You can add points in two ways:
            </p>
            <ul className="text-sm text-gray-500 text-left list-disc list-inside mb-4">
              <li><strong>Click on the map:</strong> Click on the map to add a point marker. Click on a marker to remove it.</li>
              <li><strong>Manual entry:</strong> Enter latitude and longitude values in the input fields and click "Add Point".</li>
            </ul>
            <p className="text-sm text-gray-500 text-left">
              After adding at least point, click the <strong>"Process Points"</strong> button to see the results.
            </p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={onClose}
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}