const mongoose = require("mongoose");

mongoose.connect(process.env.DB_KEY, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true
}).then(() => {
    console.log("connection Successfully")
}).catch((e) => {
    console.log(e)
})