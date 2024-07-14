export const getOrderConfirmationEmail = (customerName) => {
  return {
    subject: "Order Confirmation",
    body: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Order Confirmation</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body {
            font-family: "Roboto", sans-serif;
            margin: 0;
          }
          .content {
            padding: 10px;
          }
          .header {
            background-color: #d7153a;
            color: white;
            padding: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Thank you for your order, ${customerName}!</h1>
        </div>
        <div class="content">
          <p>We are processing your order with the following details:</p>
          <p>Thank you for choosing Chevron. We look forward to serving you again!</p>
          <p><strong>Team Chevron</strong></p>
        </div>
      </body>
    </html>
    `,
  };
};

