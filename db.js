require("dotenv").config()
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);

const contactSchema = new mongoose.Schema({
    name : {
        type: String, 
        required : true,
        unique : true
    },
    phone :{
        type : String,
        required : true,
        unique : true

    },
    email : String,
    linkedin : String,
    twitter : String
});

const Contact = mongoose.model("Contacts",contactSchema);

module.exports = Contact;