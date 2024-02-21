const otpGenerator = require("otp-generator");

const generateOtp = () => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: true,
    specialChars: true,
  });
  return otp;
};

module.exports = generateOtp();
