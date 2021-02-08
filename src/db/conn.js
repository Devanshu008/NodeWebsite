const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/DWeb", {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true
}).then(() => {
    console.log("connection Successfully")
}).catch((e) => {
    console.log(e)
})