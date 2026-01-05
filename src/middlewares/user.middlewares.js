const { errorResponseBody } = require("../utils/responseBody");
const User = require("../models/user.model");
const { USER_ROLE } = require("../utils/constants");

const validateUpdateUserRequest = async (req, res, next) => {
  try {
    const loggedInUserId = req.user; // only id from token
    const targetUserId = req.params.id;

    // must send at least one
    if (!(req.body.userRole || req.body.userStatus)) {
      errorResponseBody.err =
        "Malformed request, please send at least one parameter";
      return res.status(400).json(errorResponseBody);
    }

    // get full user from DB
    const loggedInUser = await User.findById(loggedInUserId);

    // if not found
    if (!loggedInUser) {
      errorResponseBody.err = "User not found";
      return res.status(404).json(errorResponseBody);
    }

    // user trying to update someone else
    if (
      loggedInUserId !== targetUserId &&
      loggedInUser.userRole !== USER_ROLE.admin
    ) {
      errorResponseBody.err = "Not allowed to update other users";
      return res.status(403).json(errorResponseBody);
    }
    // non-admin trying to change role/status
    if (loggedInUser.userRole !== USER_ROLE.admin) {
      errorResponseBody.err =
        "You are not allowed to update role or status — admin only";
      return res.status(403).json(errorResponseBody);
    }

    next();
  } catch (err) {
    console.log(err);
    errorResponseBody.err = "Something went wrong";
    return res.status(500).json(errorResponseBody);
  }
};

module.exports = { validateUpdateUserRequest };
