const success = (message, data) => ({
  success: true,
  message,
  data,
  err: null,
});

const failure = (message, err) => ({
  success: false,
  message,
  data: null,
  err,
});

module.exports = { success, failure };
