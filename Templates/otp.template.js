export const otpEmailTemplate = (otp) => `
<div style="
  background-color: #050a14;
  padding: 50px 20px;
  font-family: 'Inter', 'Segoe UI', Helvetica, Arial, sans-serif;
  text-align: center;
">
  <div style="
    max-width: 450px;
    margin: 0 auto;
    background-color: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  ">
    <div style="margin-bottom: 40px; text-align: left;">
        <div style="display: flex; align-items: center;">
            <span style="
                background-color: #2563eb;
                color: white;
                padding: 8px 12px;
                border-radius: 8px;
                font-weight: 900;
                font-size: 18px;
                margin-right: 10px;
            ">R</span>
            <span style="
                color: #ffffff;
                font-size: 22px;
                font-weight: 700;
                letter-spacing: -0.5px;
            ">
                Relatio <span style="color: #3b82f6;">CRM</span>
            </span>
        </div>
    </div>

    <h2 style="
        color: #ffffff;
        font-size: 24px;
        font-weight: 600;
        text-align: left;
        margin-bottom: 10px;
    ">
        Verify your identity
    </h2>
    
    <p style="
        color: #94a3b8;
        font-size: 15px;
        text-align: left;
        line-height: 1.5;
        margin-bottom: 30px;
    ">
        To complete your login to the <strong>Relatio Dashboard</strong>, please use the security code provided below.
    </p>

    <div style="
        background-color: #1e293b;
        border-radius: 12px;
        padding: 30px;
        margin-bottom: 30px;
        border: 1px solid rgba(59, 130, 246, 0.2);
    ">
      <span style="
        font-size: 36px;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: 8px;
        font-family: 'Monaco', 'Consolas', monospace;
      ">
        ${otp}
      </span>
    </div>

    <p style="
        color: #64748b;
        font-size: 13px;
        text-align: left;
        line-height: 1.6;
        margin-bottom: 30px;
        padding-left: 10px;
        border-left: 2px solid #2563eb;
    ">
        This code expires in 10 minutes. <br/>
        Admin: <strong>Mohd Faiz</strong>
    </p>

    <div style="
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        padding-top: 20px;
    ">
      <p style="
        color: #475569;
        font-size: 11px;
        font-weight: 500;
      ">
        &copy; 2026 Relatio CRM // Secure Access System
      </p>
    </div>
  </div>
</div>
`;