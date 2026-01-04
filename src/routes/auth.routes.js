const { signup, signin, resetPassword } = require("../controllers/auth.controller");
const { validateSignupRequest, validateSigninRequest, validateResetPasswordRequest, isAuthenticated } = require("../middlewares/auth.middlewares");

const routes = (app) => {
         app.post("/mba/api/v1/auth/signup" , validateSignupRequest, signup); 

         app.post("/mba/api/v1/auth/signin" , validateSigninRequest, signin); 

         app.patch("/mba/api/v1/auth/reset" ,validateResetPasswordRequest,isAuthenticated , resetPassword);
}

module.exports = routes; 