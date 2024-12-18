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
const validateEditData = (req) => {
  const validFields = ["age","gender","about","photoURL","firstName","lastName","skills"];
  const isValidEditData = Object.keys(req).every((key) => validFields.includes(key));
  return isValidEditData; 
}

const validatePassword = (req) => {
    const {password} = req;
    if(password){
        if(validator.isStrongPassword(password)) {
            return true;
        }
    }
    return false;
}
module.exports = {validateData, validateEditData, validatePassword}