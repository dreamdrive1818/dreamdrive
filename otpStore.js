// otpStore.js
const otpMap = new Map();

function generateOTP(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpMap.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
  return otp;
}

function verifyOTP(email, inputOtp) {
  const record = otpMap.get(email);
  if (!record || Date.now() > record.expiresAt) return false;
  return record.otp === inputOtp;
}

module.exports = { generateOTP, verifyOTP };
