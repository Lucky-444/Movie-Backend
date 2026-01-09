const axios = require("axios");

const sendMail = (subject, email, contents) => {
  axios.post(process.env.NOTI_SERVICE + "/notiservice/api/v1/notifications", {
    subject: subject,
    recepientEmails: [email],
    content: contents,
  });
};

module.exports = sendMail ;
