const User = require("../models/user.model")
const {userTypes} = require("../utils/constants")
const constants = require("../utils/constants")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../configs/auth.config')

module.exports.signup = async (req, res) => {
    let userStatus
    console.log(req.body)
     if(req.body.userType == userTypes.engineer || req.body.userType == userTypes.admin){
            userStatus = constants.userStatus.pending
     }else{
            userStatus = constants.userStatus.approved
        }
    
    const UserObj = {
        name: req.body.name,
        userId: req.body.userId,
        email: req.body.email,
        userType: req.body.userType,
        password: bcrypt.hashSync(req.body.password, 8),
        userStatus: userStatus
    }


    try{
        const userCreated = await User.create(UserObj)
        const postResponse = {
            name: userCreated.name,
            userId: userCreated.userId,
            email: userCreated.email,
            userType: userCreated.userType,
            userStatus: userCreated.userStatus,
            createdAt: userCreated.createdAt,
            updatedAt: userCreated.updatedAt,
        }

        res.status(201).send(postResponse)
    }catch(err){
        console.log("Something went wrong while saving to DB", err.message)
        res.status(500).send({
            message: "Some internal error while inserting the element"
        })
    }
}