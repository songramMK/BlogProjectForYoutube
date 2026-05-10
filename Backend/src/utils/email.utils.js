require("dotenv").config();
const nodemailer = require("nodemailer");
/**
 * Transporter কী কাজ করে?
 *
 * Nodemailer এ "Transporter" হলো এমন একটি object যা SMTP server এর সাথে
 * communicate করে email পাঠানোর কাজ করে।
 *
 * Google এর Gmail service এর জন্য একটি SMTP server আছে, যার মাধ্যমে
 * programmatically email send করা যায়।
 *
 * Transporter OAuth2 credentials ব্যবহার করে SMTP server এর সাথে secure
 * connection তৈরি করে। এই credentials এর মধ্যে থাকে:
 *
 * - Client ID
 * - Client Secret
 * - Refresh Token
 * - User Email
 *
 * এই তথ্যগুলো ব্যবহার করে আমাদের server → Gmail SMTP server এর সাথে
 * authenticate হয়ে secure session তৈরি করে এবং তারপর email send করে।
 *
 * সহজভাবে:
 * Transporter = Email পাঠানোর জন্য server ও Gmail SMTP এর মধ্যে bridge
 */
console.log(process.env.CLIENT_ID); 
console.log(process.env.CLIENT_SECRET) ; 
console.log(process.env.EMAIL_USER);
console.log(process.env.REFRESH_TOKEN);

const transporter = nodemailer.createTransport({

    service: "gmail",
    
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    },
});
// Connection verify করা
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});
// Email পাঠানোর function
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `Hi ${to} <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
const SendOtpFunction = async(email , otp)=>{
    const  subject=  "Send OTP";
    const text= "Hello User?" ; 
    const html = `<b>Hello ${email} </b> , Your OTP  IS <b>${otp} . It Expire In 5 minute</b>`; // HTML version of the message
    await sendEmail(email , subject ,text ,html ) ; 
}
module.exports = { sendEmail, SendOtpFunction };
