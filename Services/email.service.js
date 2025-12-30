import nodemailer from "nodemailer";


export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD,
    },
});

// send email function
export const sendEmail = async (recipient, subject, content) => {
    // content should already be the final HTML from otpEmailTemplate().replace("{otp}", otp)
    const info = await transporter.sendMail({
        from: `"CRM" <${process.env.EMAIL_USER}>`,
        to: recipient,
        subject: subject,
        html: content,   // pass the full HTML directly
    });

    console.log("Message sent:", info.messageId);
};
