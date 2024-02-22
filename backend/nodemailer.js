const nodemailer = require("nodemailer");
const otp = require("./otpgenerate");

const otpMail = () => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "abhayyadav17720@gmail.com",
      pass: "mliqhhucaiwywbks",
    },
  });

  async function main() {
    const info = await transporter.sendMail({
      from: "abhayyadav17720@gmail.com",
      to: "abhayyadav17720@gmail.com",
      subject: "OTP",
      text: `your otp is ${otp}`,
    });

    console.log("Message sent: %s", info.messageId);
  }

  console.log(otp);

  main().catch(console.error);
};
module.exports = otpMail;
