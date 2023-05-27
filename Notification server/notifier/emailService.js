const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
  service: "gmail",
  debug: true,
  auth: {
    user: "notifi_serv98@gmail.com",
    pass: "pbykyruqbaylgthz",     //password must be app password of its email
  },
});
