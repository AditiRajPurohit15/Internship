const userModel = require('../models/user.model');
const bcrypt = require('bcrypt')
const cacheInstance = require('../services/cache.service')
const sendMail = require('../services/mail.services')
const jwt = require('jsonwebtoken')
const resetPassTemplate = require('../utils/email.template')

const registerController = async(req, res)=>{
    try {
        let {name, email,  password, role}= req.body

        if(!name || !email || !password || !role){
            return res.status(400).json({
                message: "All fields are required",
            })
        }

        let existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.status(409).json({
                message: "user already exists"
            })
        }

        let newUser =await userModel.create({
            name,
            email,           
            password,
            role,
        })

        let token = newUser.generateToken()
        res.cookie("token", token);

        return res.status(201).json({
            message: "user registered",
            user: newUser,
        })

    } catch (error) {
        return res.status(500).json({
            message: "internal server error",
            error: error,
        });
    }
}

const loginController = async(req, res)=>{
    try {
        let {email, password}= req.body;

    if(!email || !password){
        return res.status(404).json({
            message:"all fields are required"
        })
    }

    let user =await userModel.findOne({email});

    if(!user){
        return res.status(404).json({
            message: "user not found"
        })
    }

    let cp =await user.comparePassword(password)

    if(!cp){
        return res.status(401).json({
            message:  "invalid credentials"
        })
    }

    let token = user.generateToken()
    res.cookie("token", token)

    return res.status(200).json({
        message: "user logedin successfully"
    })

    } catch (error) {
        console.log("error in login", error);
        return res.status(500).json({
            message: "Internal server error ",
            error: error,
        });
    }
}

const logoutController = async(req,res)=>{
    try {
        let token = req.cookies.token
        
        

        if(!token){
            res.status(404).json({
                message: "token not found"
            })
        }

        await cacheInstance.set(token, "blacklisted")
        res.clearCookie("token")
        
        

        return res.status(200).json({
            message: "user logged out successfully"
        })

    } catch (error) {
        res.status(500).json({
      message:"internal server error",
      error:error
    })
    }
}

const forgotPasswordController = async(req,res)=>{
    try {
        let {email} = req.body

        if(!email){
            res.status(404).json({message: "email not found"})
        }

        let user = await userModel.findOne({email})

        if(!user){
            res.status(404).json({message: "user not found"})
        }

        let rawToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "20min"})

         let resetLink =`http://localhost:3000/api/auth/reset-password/${rawToken}`;

         let emailTemp = resetPassTemplate(user.name, resetLink)

         await sendMail(email, 'reset password', emailTemp)

         return res.status(200).json({
      message:"Reset link sent"
    })

    } catch (error) {
        res.status(500).json({
        message:"internal server error",
        error:error
            })
    }
}
// const updatePasswordController = async (req, res)=>{
//     try {
//         let user_id = req.params.id
//         const {password, confirmPassword} = req.body

//         console.log("password from ejs: ",password)
//         console.log("confirm password from ejs: ",confirmPassword)
//         console.log("user_id: ", user_id);
        
//         if(!user_id){
//             return res.status(404).json({message: "user_id not found"})
//         }

//         if(!password || !confirmPassword){
//             return res.status(400).json({message: "both password and change password are required fields"})
//         }

//         if(password !== confirmPassword){
//             return res.status(400).json({message: "passwords do not match"})
//         }

//         const hashedPassword = await bcrypt.hash(password, 10)

//         const updateUser = await userModel.findByIdAndUpdate(
//             user_id,
//             {password: hashedPassword},
//             {new: true}
//         )

//         if(!updateUser){
//             return res.status(404).json({message: "User not found"})
//         }

//         return res.status(200).json({message : "password updated successfully"})

//     } catch (error) {
//          console.error("Error in updatePasswordController:", error);
//         return res.status(500).json({ message: "Internal server error", error });
//     }
// }

// const resetPasswordController = async (req, res)=>{
//     let token = req.params.token

//     if(!token){return res.status(404).json({message: "token not found"})}

//     let decode = jwt.verify(token, process.env.JWT_SECRET)
//     return res.render('index.ejs', {user_id: decode.id})

// }


module.exports={
    registerController,
    loginController,
    logoutController,
    forgotPasswordController,
    // updatePasswordController,
    // resetPasswordController,
}