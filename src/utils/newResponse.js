const success = (res, { message = "OK", data = null, status = 200 }) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    err: null,
  });
};

const failure = (
  res,
  { message = "Something went wrong", err = null, status = 500, data = null }
) => {
  return res.status(status).json({
    success: false,
    message,
    data,
    err,
  });
};

module.exports = { success, failure };
