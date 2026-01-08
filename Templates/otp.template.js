export const otpEmailTemplate = (otp) => `
<div style="
  background-color: #0a0c10;
  padding: 50px 20px;
  font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
  text-align: center;
">
  <div style="
    max-width: 450px;
    margin: 0 auto;
    background-color: #121418;
    border: 1px solid #1e293b;
    border-radius: 40px;
    padding: 40px;
  ">
    <div style="margin-bottom: 30px;">
        <div style="
            display: inline-block;
            padding: 10px 20px;
            border-left: 4px solid #2563eb;
            background: rgba(37, 99, 235, 0.05);
        ">
            <span style="
                color: #ffffff;
                font-size: 20px;
                font-weight: 900;
                letter-spacing: -1px;
                text-transform: uppercase;
                font-style: italic;
            ">
                COMPANY LOGO
            </span>
        </div>
    </div>

    <h2 style="
        color: #ffffff;
        font-size: 24px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: -0.5px;
        margin-bottom: 10px;
    ">
        Security Authorization
    </h2>
    
    <p style="
        color: #94a3b8;
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 35px;
    ">
        Enter the following code to log on
    </p>

    <div style="
        background-color: #0a0c10;
        border: 1px solid #334155;
        border-radius: 20px;
        padding: 25px;
        margin-bottom: 35px;
    ">
      <span style="
        font-size: 42px;
        font-weight: 900;
        color: #2563eb;
        letter-spacing: 12px;
        font-family: 'Courier New', Courier, monospace;
      ">
        ${otp}
      </span>
    </div>

    <p style="
        color: #64748b;
        font-size: 12px;
        line-height: 1.6;
        margin-bottom: 25px;
    ">
        This verification code is valid for 10 minutes. <br/>
        If you did not request this access, please secure your account immediately.
    </p>

    <div style="
        border-top: 1px solid #1e293b;
        padding-top: 25px;
    ">
      <p style="
        color: #475569;
        font-size: 10px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 2px;
      ">
        &copy; 2026 YourCompanyName // System Core
      </p>
    </div>
  </div>
</div>
`;