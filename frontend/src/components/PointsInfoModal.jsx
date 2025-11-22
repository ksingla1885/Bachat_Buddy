import React from 'react';
import { X } from 'lucide-react';

function PointsInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen pt-20 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity" 
          aria-hidden="true" 
          onClick={onClose}
        ></div>

        {/* Modal content */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-xl px-6 pt-6 pb-6 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-8 relative z-[9999] mx-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div>
            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                Points System & Policies
              </h3>
              
              <div className="mt-2 space-y-6">
                <div>
                  <h4 className="text-md font-medium text-blue-600 dark:text-blue-400 mb-2">🎯 How to Earn Points</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                    <li>Complete your profile: <span className="font-medium">+100 points</span></li>
                    <li>Add first transaction: <span className="font-medium">+50 points</span></li>
                    <li>Maintain budget for a week: <span className="font-medium">+200 points</span></li>
                    <li>Pay off a debt: <span className="font-medium">+150 points</span></li>
                    <li>Reach a savings goal: <span className="font-medium">+300 points</span></li>
                    <li>7-day login streak: <span className="font-medium">+100 points</span></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-md font-medium text-blue-600 dark:text-blue-400 mb-2">🏆 Points Tiers</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                    <li>Bronze: 0-999 points</li>
                    <li>Silver: 1,000-4,999 points</li>
                    <li>Gold: 5,000-9,999 points</li>
                    <li>Platinum: 10,000+ points</li>
                  </ul>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-md font-medium text-red-600 dark:text-red-400 mb-2">📝 Debt Deletion Policy</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                    <li>Debts marked as "Paid" will be archived automatically after 30 days</li>
                    <li>You can manually delete unpaid debts at any time</li>
                    <li>Deleting a debt will remove it from all reports and statistics</li>
                    <li>Points earned from paying off a debt will not be revoked if the debt is later deleted</li>
                    <li>We recommend exporting your debt history before deleting if you need to keep records</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
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

export default PointsInfoModal;
