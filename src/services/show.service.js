const Show = require("../models/show.model");
const { STATUS } = require("../utils/constants");

const createShowService = async (showData) => {
  try {
    const response = await Show.create(showData);
    return response;
  } catch (error) {
    if (error.name === "ValidationError") {
      let err = {};
      for (field in error.errors) {
        err[field] = error.errors[field].message;
      }
      throw {
        err,
        code: STATUS.UNPROCESSABLE_ENTITY,
      };
    }
    throw error;
  }
};


module.exports = {
         createShowService,
};
