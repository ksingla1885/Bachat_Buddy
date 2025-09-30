const axios = require('axios');

// Test script to verify debt deletion works
async function testDebtDeletion() {
  try {
    console.log('🧪 Testing debt deletion functionality...');

    // First, try to get debts to see if backend is working
    console.log('📋 Fetching debts...');
    const response = await axios.get('http://localhost:5001/api/debts', {
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || 'your-test-token'}`
      }
    });

    console.log('✅ Debts fetched successfully:', response.data.data.length, 'debts found');

    if (response.data.data.length === 0) {
      console.log('ℹ️  No debts found to test deletion');
      return;
    }

    // Try to delete the first debt
    const debtToDelete = response.data.data[0];
    console.log('🗑️  Attempting to delete debt:', debtToDelete.title, '(Status:', debtToDelete.status + ')');

    const deleteResponse = await axios.delete(`http://localhost:5001/api/debts/${debtToDelete._id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || 'your-test-token'}`
      }
    });

    console.log('✅ Debt deleted successfully:', deleteResponse.data.message);

  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data.message);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testDebtDeletion();
