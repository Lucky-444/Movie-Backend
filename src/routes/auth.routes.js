const { signup, signin, resetPassword } = require("../controllers/auth.controller")

const routes = (app) => {
         app.post("/mba/api/v1/auth/signup" , signup); 

         app.post("/mba/api/v1/auth/signin" , signin); 

         app.patch("/mba/api/v1/auth/reset" , resetPassword);
}

module.exports = routes; 