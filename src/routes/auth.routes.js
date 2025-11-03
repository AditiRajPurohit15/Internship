const express = require('express')
const {
    registerController,
    loginController,
    logoutController,
    forgotPasswordController,
  
}= require("../controllers/auth.controller")
const authMiddleware = require('../middlewares/auth.middlewares')

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/me',authMiddleware, (req,res)=>{
    try {
        if(!req.user){
        return res.status(404).json({ message: "User not found" });
    }
    const {_id,name,email,role}= req.user
    return res.status(200).json({ 
        message: "User authenticated",
        user: { _id, name, email, role },
    })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
})
router.post('/logout', logoutController);
router.post('/forgot-password', forgotPasswordController);


module.exports = router