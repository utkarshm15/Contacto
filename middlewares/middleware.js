const jwt = require("jsonwebtoken");

function userMiddleware(req,res,next){
    const auth = req.headers.authorization;
    if(!auth || !auth.startsWith("Bearer")){
        return res.status(401).json({
            message : "You are not authorized"
        })
    }
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token,"abc");
    if(!payload){
        return res.status(401).json({
            message : "You are not authorized"
        })
    }
    next();
}

module.exports = userMiddleware;