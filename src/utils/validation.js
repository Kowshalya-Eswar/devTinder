const validator = require('validator');
const validateData = (req) => {
    const {firstName, lastName, gender,emailId, password} = req;
    if (!firstName) {
        throw new Error("FirstName should not be empty");
    } else if (!lastName) {
        throw new Error("LastName should not be empty");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email Id is not valid");
    } else if (!["female","male","others"].includes(gender)) {
        throw new Error("not valid gender");
    } 
};

module.exports = {validateData}