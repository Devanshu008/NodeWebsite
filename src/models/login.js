const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
        },
        tokens: [{
            token: {
                type: String,
                required: true,
            }
        }]
    })
    //generating token
loginSchema.methods.generateAuthToken = async function() {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token })
        await this.save();
        return token;
    } catch (error) {
        res.send(error);
        console.log("the error part" + error);
    }
}

//converting password into hash
loginSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        this.cPassword = await bcrypt.hash(this.password, 10);
    }
    next();
})

const Register = new mongoose.model("RegisterUser", loginSchema);

module.exports = Register;