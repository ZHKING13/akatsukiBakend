const userModel = require("../Models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv').config()
const { TOKEN_KEY } = process.env
const axios = require('axios');

//generate token
const generateToken = (user) => {
        const token = jwt.sign({ _id: user._id }, TOKEN_KEY)
        return token
    }
    //register user
const register = async(req, res) => {
    try {
        const { email, password, name } = req.body;

        // if any one of the field from email and password is not filled
        if (!email || !password) {
            return res.json({
                success: false,
                message: "email or password is empty",
            });
        }
        // if user already exists
        let user = await userModel.findOne({ email });
        if (user) {
            return res.json({
                success: false,
                message: "user already exists",
            });
        }
        // if user does not exists
        req.body.password = await bcrypt.hash(password, 10);
        user = await userModel.create(req.body);
        await user.save();
        let token = generateToken(user);
        const option = { expires: new Date(Date.now() + 2 * 60 * 60 * 1000), httpOnly: true }
        const message = `📍📍📍 Nouvelle utilisateur  crée 📍📍📍 : \n nom : ${user.name} \n email: ${user.email}. \n id : ${user._id}`;
        const response = await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
            chat_id: process.env.CHAT_ID,
            text: message,

        });
        return res.cookie("token", token, option).json({
            success: true,
            message: "user registered successfully",
            data: user,
            token: token
        });

    } catch (error) {
        return res.send(error.message);
    }

};

//login user
const login = async(req, res) => {

    try {
        const { email, password } = req.body;
        // if any one of the field from email and password is not filled
        if (!email || !password) {
            return res.json({
                success: false,
                message: "email or password is empty",
            });
        }
        let user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                status: 400,
                message: "user does not exist with this email and password",
            });
        }
        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({
                success: false,
                message: "invalid credentials",
            });
        }
        // generate token
        const token = generateToken(user);
        const option = { expires: new Date(Date.now() + 2 * 60 * 60 * 1000), httpOnly: true }
        return res.cookie("token", token, option).json({
            success: true,
            status: 200,
            message: "user logged in successfully",
            data: user,
            token
        })

    } catch (error) {
        console.log(error)
    }
}

//get user  
const getMe = async(req, res) => {
    try {
        //get token from header
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
        console.log(decoded)
        if (!token) {
            return res.status(401).json({
                message: "please login first"
            });
        }
        let user = await userModel.findById(decoded._id)
        if (!user) {
            return res.status(401).json({
                message: "user not found"
            });
        }
        return res.status(200).json({
            success: true,
            user
        });



    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            succes: false,
            message: error.message

        })
    }
}

//get all users

const getAllUser = async(req, res) => {

    try {
        const users = await userModel.find()
        return res.json({
            success: true,
            status: 200,
            message: "user fetched successfully",
            data: users,
        })
    } catch (error) {
        console.log(error.message)
    }

}

// s'emarger 
const setEmargement = async(req, res) => {

    try {
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
        console.log(decoded)
        if (!token) {
            return res.status(401).json({
                message: "please login first"
            });
        }
        let user = await userModel.findById(decoded._id)
            // verifier si le dernier emargement date de plus de 22h
        const lastPresent = user.lastEmargement
            // check if current date - lasPresent > 22h
        const currentDate = new Date()
        const diff = currentDate - lastPresent
        if (diff < 79200000) {
            return res.json({
                success: false,
                status: 400,
                message: "vous avez déja fait l'emargement aujourd'hui",
            });
        }

        // update lastEmargement
        user.totalEmargements += 1
        user.lastEmargement = Date.now()
        await user.save()
        return res.json({
            success: true,
            status: 200,
            message: "emargement effectuer avec succes",
            data: user,
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            succes: false,
            message: error.message

        })
    }
}

//export all functions

module.exports = {

    register,
    login,
    getMe,
    getAllUser,
    setEmargement
}