export const otpVerificationEmail = (customerName, otp) => {
    return {
      subject: "OTP Verification",
      body: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>OTP Verification</title>
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
            <h1>Hello, ${customerName}!</h1>
          </div>
          <div class="content">
            <p>Your OTP for verification is: <strong>${otp}</strong></p>
            <p>Please use this OTP to complete your verification process.</p>
            <p>If you didn't request this OTP, please ignore this email.</p>
            <p><strong>Team Chevron</strong></p>
          </div>
        </body>
      </html>
      `,
    };
  };
  