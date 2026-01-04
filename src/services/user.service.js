const User = require("../models/user.model");
const { USER_ROLE, USER_STATUS, STATUS } = require("../utils/constants");

const createUser = async (data) => {
  try {
    //If the user has no role provided, OR their role is customer…
    //So two cases:
    //data.userRole is undefined/null
    //data.userRole is 'customer'
    // If a status is provided AND it is NOT approved…

    //Why Throw Error
    //Because customers can only have approved status when created
    //Customers are always approved by default. They cannot be pending or rejected.
    //So if someone is trying to create a customer with pending/rejected status, block it.
    //So customers must only ever have:
    //userStatus = approved
    if (!data.userRole || data.userRole == USER_ROLE.customer) {
      if (data.userStatus && data.userStatus != USER_STATUS.approved) {
        throw {
          err: "We cannot set any other status for customer",
          code: 400,
        };
      }
    }

    //If the user has a role AND it's NOT a customer,
    //automatically set their status to pending.

    //So admins, managers, etc. must be reviewed first.
    if (data.userRole && data.userRole != USER_ROLE.customer) {
      data.userStatus = USER_STATUS.pending;
    }

    //To enforce business rules in backend so nobody can create:
    // customers with pending/rejected status
    // admins with approved immediately

    const response = await User.create(data);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    if (error.name == "ValidationError") {
      let err = {};
      Object.keys(error.errors).forEach((key) => {
        err[key] = error.errors[key].message;
      });
      //passing err object and 422 status code to the controller
      throw { err: err, code: 422 };
    }
    throw error;
  }
};


const getUserByEmail = async (email) => {
  try {
    const response = await User.findOne({
      email: email,
    });
    if (!response) {
      throw { err: "No user found for the given email", code: 404 };
    }
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw { err: "No user found for the given id", code: 404 };
    }
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};



const updateUserRoleOrStatus = async (data, userId) => {
  try {
    let updateQuery = {};
    if (data.userRole) updateQuery.userRole = data.userRole;
    if (data.userStatus) updateQuery.userStatus = data.userStatus;

    let response = await User.findByIdAndUpdate(userId, updateQuery, {
      new: true,
      runValidators: true,
    });

    if (!response)
      throw { err: "No user found for the given id", code: STATUS.NOT_FOUND };

    return response;
  } catch (error) {
    console.log(error, error.name);
    if (error.name == "ValidationError") {
      let err = {};
      Object.keys(error.errors).forEach((key) => {
        err[key] = error.errors[key].message;
      });
      throw { err: err, code: STATUS.BAD_REQUEST };
    }
    throw error;
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserRoleOrStatus,
};
