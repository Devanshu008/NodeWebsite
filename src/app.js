const express = require("express");
require("./db/conn")
const User = require("./models/userMessage")
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const hbs = require("hbs");
const { normalize } = require("path");

const staticPath = path.join(__dirname, "../public")
const templatesPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
app.use(express.urlencoded({ extended: false }))
app.use(express.static(staticPath));
app.use('/css', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")))
app.use('/js', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")))
app.use('/jq', express.static(path.join(__dirname, "../node_modules/jquery/dist")))
app.set("view engine", "hbs");
app.set("views", templatesPath);
hbs.registerPartials(partialsPath);


app.get("/", (req, res) => {
    res.render("login")
});
// app.get("/contact", (req, res) => {
//     res.render("contact")
// });
app.post("/contact", async(req, res) => {
    try {
        // res.send(req.body)
        const userData = new User(req.body);
        await userData.save()
        res.status(201).render("index")
    } catch (error) {
        res.status(500).send(error);
    }
});
app.get("/login", (req, res) => {
    res.render("login")
});
app.get("/homepage", (req, res) => {
    res.render("index")
});
app.listen(port, () => {
    console.log(`Server is running into ${port}....`)
})