require('dotenv').config();
const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser')
require("./db/conn")
const User = require("./models/userMessage");
const Register = require("./models/login");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const hbs = require("hbs");
const jwt = require("jsonwebtoken");
const { normalize } = require("path");
const Noty = require('noty');
const { data } = require('jquery');
const auth = require('./middleware/auth');
const staticPath = path.join(__dirname, "../public")
const templatesPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
app.use(express.urlencoded({ extended: false }))
app.use(express.static(staticPath));
app.use(cookieParser());
app.use('/css', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")))
app.use('/js', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")))
app.use('/jq', express.static(path.join(__dirname, "../node_modules/jquery/dist")))
app.set("view engine", "hbs");
app.set("views", templatesPath);
hbs.registerPartials(partialsPath);


app.get("/", (req, res) => {
    res.render("login")
});

app.get("/logout", auth, async(req, res) => {
    try {
        res.clearCookie("jwt");
        console.log("logout successfully")
        await req.user.save();
        res.send("login")
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post("/contact", async(req, res) => {
    try {
        // res.send(req.body)
        const userData = new User(req.body);
        await userData.save()

        res.status(201).render("index");

    } catch (error) {
        res.status(500).send(error);
    }
});
app.post("/login", async(req, res) => {
    try {
        const password = req.body.password;
        const cPassword = req.body.cPassword;
        if (password === cPassword) {
            const registerData = new Register(req.body);
            const token = await registerData.generateAuthToken();
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 500000),
                httpOnly: true
            });
            const registered = await registerData.save();
            // new Noty({
            //     text: 'Thank You....'
            // }).show();
            res.status(201).render("index");
        } else {
            res.send("Password are not same");
        }

    } catch (error) {
        res.status(500).send(error);
    }

});
app.post("/homepage", async(req, res) => {
    try {
        const userEmail = req.body.userEmail;
        const userPassword = req.body.userPassword;
        const uEmail = await Register.findOne({ email: userEmail });
        const isMatch = await bcrypt.compare(userPassword, uEmail.password)
        const token = await uEmail.generateAuthToken();
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 500000),
            httpOnly: true,
            // secure:true
        });

        if (isMatch) {
            res.status(201).render('index');
        } else {
            res.send("Invalid login details");
        }

    } catch (error) {
        res.status(500).send("Invalid login details");
    }
});
app.get("/homepage", auth, (req, res) => {
    res.clearCookie("jwt");
    res.render("index")
});
app.listen(port, () => {
    console.log(`Server is running into ${port}....`)
})