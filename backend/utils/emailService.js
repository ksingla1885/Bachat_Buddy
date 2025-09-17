const nodemailer = require('nodemailer');

// Create transporter (configure with your email service in production)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: process.env.SMTP_PORT || 2525,
  auth: {
    user: process.env.SMTP_USER || 'your-smtp-user',
    pass: process.env.SMTP_PASS || 'your-smtp-password'
  }
});

// Send budget alert email
exports.sendBudgetAlert = async (userEmail, budgetData) => {
  const { category, budgetAmount, spentAmount, threshold } = budgetData;
  
  const emailContent = {
    from: '"BachatBuddy" <notifications@bachatbuddy.com>',
    to: userEmail,
    subject: `Budget Alert: ${category} spending has reached ${threshold}%`,
    html: `
      <h2>Budget Alert</h2>
      <p>Your spending in the ${category} category has reached ${threshold}% of your budget.</p>
      <ul>
        <li>Budget Amount: ₹${budgetAmount}</li>
        <li>Amount Spent: ₹${spentAmount}</li>
        <li>Remaining: ₹${budgetAmount - spentAmount}</li>
      </ul>
      <p>Please review your spending to stay within your budget.</p>
      <p>Best regards,<br>BachatBuddy Team</p>
    `
  };

  try {
    await transporter.sendMail(emailContent);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Send monthly budget summary
exports.sendMonthlySummary = async (userEmail, summaryData) => {
  const { month, year, categories } = summaryData;
  
  let categoriesHtml = categories
    .map(cat => `
      <tr>
        <td>${cat.name}</td>
        <td>₹${cat.budget}</td>
        <td>₹${cat.spent}</td>
        <td>${cat.percentage}%</td>
      </tr>
    `)
    .join('');

  const emailContent = {
    from: '"BachatBuddy" <notifications@bachatbuddy.com>',
    to: userEmail,
    subject: `Monthly Budget Summary - ${month}/${year}`,
    html: `
      <h2>Monthly Budget Summary</h2>
      <p>Here's your spending summary for ${month}/${year}:</p>
      <table style="width:100%; border-collapse: collapse;">
        <tr>
          <th style="text-align: left;">Category</th>
          <th style="text-align: left;">Budget</th>
          <th style="text-align: left;">Spent</th>
          <th style="text-align: left;">% Used</th>
        </tr>
        ${categoriesHtml}
      </table>
      <p>Keep tracking your expenses with BachatBuddy!</p>
      <p>Best regards,<br>BachatBuddy Team</p>
    `
  };

  try {
    await transporter.sendMail(emailContent);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
