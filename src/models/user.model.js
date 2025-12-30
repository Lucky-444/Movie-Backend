const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { USER_ROLE, USER_STATUS } = require("../utils/constants");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, " name is Required"], 
      unique: true,
    },
    email: {
      type: String,          // value must be a string
      required: [true , "email is required"],    // must be provided (cannot be null / missing)
      unique: true,          // no two users can have the same email in the DB
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email",
      ],                     // regex validation
      lowercase: true,       // automatically converts to lowercase
      trim: true,            // removes spaces from start & end
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    userRole: {
      type: String,
      required: true,
      enum: {
        values: [USER_ROLE.customer, USER_ROLE.admin, USER_ROLE.client],
        message: "Invalid user role given",
      },
      default: USER_ROLE.customer,
    },
    userStatus: {
      type: String,
      required: true,
      enum: {
        values: [
          USER_STATUS.approved,
          USER_STATUS.pending,
          USER_STATUS.rejected,
        ],
        message: "Invalid status for user given",
      },
      default: USER_STATUS.approved,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
