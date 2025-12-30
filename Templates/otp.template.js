export const otpEmailTemplate = () => `
<div style="
  padding: 40px;
  background: linear-gradient(135deg, #012A4A, #01497C, #013A63);
  font-family: 'Arial', sans-serif;
">
  <div style="
    max-width: 480px;
    margin: auto;
    background: #ffffff;
    border-radius: 22px;
    padding: 32px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    border: 1px solid #e0e0e0;
  ">

    <p style="
      font-size: 16px;
      text-align: center;
      color: #012A4A;
      margin-bottom: 20px;
    ">
      Use the OTP below to verify your email:
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <span style="
        display: inline-block;
        font-size: 34px;
        font-weight: 800;
        padding: 15px 35px;
        border-radius: 16px;
        color: #fff;
        background: linear-gradient(135deg, #01497C, #013A63);
        border: 2px solid #013A63;
        box-shadow: 0px 4px 15px rgba(0,0,0,0.2);
      ">
        {otp}
      </span>
    </div>

    <p style="
      text-align: center;
      font-size: 14px;
      color: #01497C;
      margin-bottom: 10px;
      font-weight: bold;
    ">
      OTP Welcome to "company Name".
    </p>

    <p style="
      text-align: center;
      font-size: 13px;
      color: #777;
      margin-top: 30px;
    ">
      If you did not request this, please ignore this email.
    </p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;" />

    <p style="
      text-align: center;
      font-size: 12px;
      color: #555;
      margin: 0;
    ">
      © 2025 YourCompanyName. All rights reserved.
    </p>

  </div>
</div>
`;
console.log(otpEmailTemplate)