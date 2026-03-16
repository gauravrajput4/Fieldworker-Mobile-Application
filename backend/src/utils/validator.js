exports.validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

exports.validateMobile = (mobile) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(mobile);
};
