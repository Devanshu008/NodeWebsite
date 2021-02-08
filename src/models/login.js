const mongoose = require("mongoose");
const validator = require("validator");

const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Your Email");
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    cPassword: {
        type: String,
        required: true,
    }
})

const Register = new mongoose.model("RegisterUser", loginSchema);

module.exports = Register;