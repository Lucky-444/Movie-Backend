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


// This is called Mongoose Middleware (Hook) — specifically a:
//Pre-save middleware / pre hook
/**It runs automatically BEFORE the document is saved to MongoDB. 
 *  intercept the save operation
  *  hash the password
  * then continue
 */
userSchema.pre("save", async function () {
  // a trigger to encrypt the plain password before saving the user
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

});

/**
 * This is going to be an instance method for user, to compare a password
 * with the stored encrypted password
 * @param plainPassword -> input password given by user in sign in request
 * @returns boolean denoting whether passwords are same or not ?
 */

//Instance Method (Schema Method)
//Mongoose instance method
userSchema.methods.isValidPassword = async function (plainPassword) {
  const currentUser = this;
  const compare = await bcrypt.compare(plainPassword, currentUser.password);
  return compare;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
