const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "tpanchulidze@unisens.ge",
    subject: "email from Task-app",
    text: `Welcome to the Task-app, ${name}. You sign up successfully`,
  });
};

const sendDeleteAccounEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "tpanchulidze@unisens.ge",
    subject: "email from Task-app",
    text: `${name}, you'r account delete successfully`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendDeleteAccounEmail,
};
