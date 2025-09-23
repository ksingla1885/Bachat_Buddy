// Navigation configuration
export const navigationItems = [
  { path: '/dashboard', name: 'Dashboard', icon: '📊' },
  {
    name: 'Transactions',
    icon: '💸',
    type: 'dropdown',
    children: [
      { path: '/wallets', name: 'Wallets', icon: '💳' },
      { path: '/transactions', name: 'Transactions', icon: '💸' },
      { path: '/budgets', name: 'Budgets', icon: '📈' }
    ]
  },
  { path: '/debts', name: 'Debts', icon: '💰' },
  { path: '/reports', name: 'Reports', icon: '📊' },
  {
    name: 'Achievements',
    icon: '🏆',
    type: 'dropdown',
    children: [
      { path: '/goals', name: 'Goals', icon: '🎯' },
      { path: '/achievements', name: 'Points', icon: '🏆' }
    ]
  },
];

export default navigationItems;
