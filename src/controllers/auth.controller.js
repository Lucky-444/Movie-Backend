const jwt = require("jsonwebtoken");

const {
  successResponseBody,
  errorResponseBody,
} = require("../utils/responseBody");

const {
  createUser,
  getUserByEmail,
  getUserById,
} = require("../services/user.service");

const signup = async (req, res) => {
  try {
    const response = await createUser(req.body);
    successResponseBody.data = response;
    successResponseBody.message = "Successfully registered a user";
    return res.status(201).json(successResponseBody);
  } catch (error) {
    console.log(error);
    if (error.err) {
      //receving err object and status code from service
      //so error.err is set to response body and status code is set accordingly
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err = error;
    return res.status(500).json(errorResponseBody);
  }
};

const signin = async (req, res) => {
  try {
    const user = await getUserByEmail(req.body.email);
    //used our own instance method to validate password
    // compares plain password with hashed password
    //user -> gives current User Instance
    const isValidPassword = await user.isValidPassword(req.body.password);

    if (!isValidPassword) {
      throw { err: "Invalid password for the given email", code: 401 };
    }

    console.log("User iS", user.id);

    //this id returns string version of _id
    //always stringify the id to avoid issues
    /**
     * And Later on while verifying the token
     * const response = jwt.verify(token, process.env.AUTH_KEY);
     * const user = await userService.getUserById(response.id);
     */
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.AUTH_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true, // JS cannot read it (XSS protection)
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "strict", // prevents CSRF in most cases
      maxAge: 60 * 60 * 1000, // 1 hour in ms
    });

    successResponseBody.message = "Successfully logged in";
    successResponseBody.data = {
      email: user.email,
      role: user.userRole,
      status: user.userStatus,
      token: token,
    };

    return res.status(200).json(successResponseBody);
  } catch (error) {
    if (error.err) {
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    console.log(error);
    errorResponseBody.err = error;
    return res.status(500).json(errorResponseBody);
  }
};

/***
 * Reset Password Controller
 * Get the user from req.user -> set by auth middleware
 * Compare old password and if correct allow to set new password
 * Save the user
 * 
 * req body = {
 * oldPassword: "oldpassword",
 * newPassword: "newpassword"
 * }
 */

const resetPassword = async (req, res) => {
  try {
  
    const user = await getUserById(req.user);
    const isOldPasswordCorrect = await user.isValidPassword(
      req.body.oldPassword
    );
    if (!isOldPasswordCorrect) {
      throw {
        err: "Invalid old password, please write the correct old password",
        code: 403,
      };
    }
    user.password = req.body.newPassword;
    await user.save();
    successResponseBody.data = user;
    successResponseBody.message =
      "Successfully updated the password for the given user";
    return res.status(200).json(successResponseBody);
  } catch (error) {
    if (error.err) {
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err = error;
    return res.status(500).json(errorResponseBody);
  }
};

module.exports = {
  signup,
  signin,
  resetPassword,
};
