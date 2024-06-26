const {Router} = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const userMiddleware = require("../middlewares/middleware");
const Contact = require("../db");
const { encryptNumber, decryptNumber } = require("../controllers/encryption");
const contactRouter = Router();

//-----------------------------------------------------------------------------------------------------------------------
contactRouter.get("/",(req,res)=>{
    res.send("Welcome to Contacto");
})


//------------------------------------------------------------------------------------------------------------------
const signinBodySchema = zod.object({
    username : zod.string(),
    password : zod.string()
})
//http://localhost:3000/api/v1/signin (post)
contactRouter.post("/signin",(req,res)=>{
    const {success} = signinBodySchema.safeParse(req.body);
    if(!success){
        return res.status(400).json({
            message : "Invalid Entry"
        })
    }
    if(req.body.username != "saltman" || req.body.password != "oai1122"){
        return res.status(400).json({
            message : "Invalid Username or Password"
        }) 
    }
    const token = jwt.sign(req.body,"abc");
    res.status(200).json({
        message : "Signed in successfully",
        token : token
    })
})
//----------------------------------------------------------------------------------------------------------------------

const contactBodySchema = zod.object({
    name : zod.string(),
    number : zod.number(),
})
//http://localhost:3000/api/v1/contact (post)
contactRouter.post("/contact",userMiddleware,async(req,res)=>{
    const {success} = contactBodySchema.safeParse(req.body);
    if(!success){
        return res.status(400).json({
            message : "Inavlid Inputs"
        })
    }
    const existingContact = await Contact.findOne({
        $or : [ {
            name : req.body.name
        },
        {
            phone : encryptNumber(req.body.number)
        }]});
    if(existingContact){
        return res.status(400).json({
            message : "Contact already exists"
        })
    }
    try{
    await Contact.create({
        name : req.body.name,
        phone : encryptNumber(req.body.number)
    })
    res.status(200).json({
        message : "Contact created successfullt"
    }
    )}
    catch(e){
        res.status(500).json({
            message : "Error while creating"
        })
    }}
)
//-----------------------------------------------------------------------------------------------------------------------


const updateBodySchema = zod.object({
    name : zod.string(),
    email : zod.string().optional(),
    linkedin : zod.string().optional(),
    twitter : zod.string().optional()
})
//http://localhost:3000/api/v1/contact (put)
contactRouter.put("/contact",userMiddleware,async(req,res)=>{
    const {success} = updateBodySchema.safeParse(req.body);
    if(!success){
        return res.status(400).json({
            message : "Invalid Entry"
        })
    }
    const existingContact = await Contact.findOne({name : req.body.name});
    if(!existingContact){
        return res.status(400).json({
            message : "Contact does not exist"
        })
    }
    try{
    await Contact.updateOne({name : req.body.name},req.body);
    res.status(200).json({
        message : "Details updated successfully"
    })
    }
    catch(e){
        res.status(500).json({
            message : "Error while updating"
        })
    }
})

//-------------------------------------------------------------------------------------------------------------------------
const search_tokenSchema = zod.string()
// use http://localhost:3000/api/v1/contact/search (post)
contactRouter.post("/contact/search",userMiddleware,async(req,res)=>{
    const {success} = search_tokenSchema.safeParse(req.body.search_token);
    if(!success){
        return res.status(400).json({
            message : "Invalid inputs"
        })
    }
    let contacts = await Contact.find({
        name : { "$regex" : req.body.search_token, "$options" : "i" }
    });
    contacts = contacts.map((contact)=>{
        contact.phone = decryptNumber(contact.phone);
        return contact
    })
    res.status(200).json(contacts);
})

module.exports = contactRouter;