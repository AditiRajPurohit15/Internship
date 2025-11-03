const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const cacheInstance = require('../services/cache.service')


const authMiddleware = async (req, res, next)=>{
    try {
        // console.log("JWT_SECRET:", process.env.JWT_SECRET);
        let token = req.cookies.token
        console.log("Incoming Token:", token);

        if(!token){
            return res.status(404).json({
                message: "token not found",
            })
        }

        let isblacklisted = await cacheInstance.get(token);
        if(isblacklisted){
            return res.status(400).json({messsage: "token blacklisted"})
        }

        let decode = jwt.verify(token, process.env.JWT_SECRET)
        console.log("Decoded JWT:", decode);

        let user = await userModel.findById(decode.id)
        console.log("User fetched from DB:", user);

        if(!user){
            return res.status(404).json({message: "user not found"})
        }

        req.user = user
        next()

    } catch (error) {
        return res.status(500).json({
            message:"error in middleware",
            error: error,
        })
    }
}
module.exports = authMiddleware
