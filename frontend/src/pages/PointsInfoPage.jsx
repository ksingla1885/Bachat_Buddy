import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function PointsInfoPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Points System & Policies</h1>
            
            <div className="space-y-10">
              <div>
                <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  🎯 How to Earn Points
                </h2>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <div>
                      <span className="font-medium">Complete your profile:</span> 
                      <span className="ml-2 text-gray-500 dark:text-gray-400">+100 points</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <div>
                      <span className="font-medium">Add first transaction:</span> 
                      <span className="ml-2 text-gray-500 dark:text-gray-400">+50 points</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <div>
                      <span className="font-medium">Maintain budget for a week:</span> 
                      <span className="ml-2 text-gray-500 dark:text-gray-400">+200 points</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <div>
                      <span className="font-medium">Pay off a debt:</span> 
                      <span className="ml-2 text-gray-500 dark:text-gray-400">+150 points</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <div>
                      <span className="font-medium">Reach a savings goal:</span> 
                      <span className="ml-2 text-gray-500 dark:text-gray-400">+300 points</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <div>
                      <span className="font-medium">7-day login streak:</span> 
                      <span className="ml-2 text-gray-500 dark:text-gray-400">+100 points</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  🏆 Points Tiers
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { tier: 'Bronze', points: '0-999', color: 'from-amber-600 to-amber-700' },
                    { tier: 'Silver', points: '1,000-4,999', color: 'from-gray-400 to-gray-500' },
                    { tier: 'Gold', points: '5,000-9,999', color: 'from-yellow-400 to-yellow-500' },
                    { tier: 'Platinum', points: '10,000+', color: 'from-purple-500 to-pink-500' }
                  ].map((item) => (
                    <div key={item.tier} className={`bg-gradient-to-r ${item.color} rounded-lg p-6 text-white`}>
                      <h3 className="text-xl font-bold mb-1">{item.tier}</h3>
                      <p className="text-sm opacity-90">{item.points} points</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r">
                <h2 className="text-xl font-semibold text-yellow-700 dark:text-yellow-400 mb-3">
                  📝 Debt Deletion Policy
                </h2>
                <ul className="space-y-2 text-yellow-700 dark:text-yellow-300">
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    Debts marked as "Paid" will be archived automatically after 30 days
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    You can't manually delete unpaid debts at any time
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    Deleting a debt will remove it from all reports and statistics
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    Points earned from paying off a debt will not be revoked if the debt is later deleted
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    We recommend exporting your debt history before deleting if you need to keep records
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PointsInfoPage;
