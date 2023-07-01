const otpModel = require('../Models/Otp');
const sendEmail = require('../util/sendMail');
const { AUTH_MAIL } = process.env
    //sned otp to user email
module.exports.sendOtp = async(req, res) => {

        try {
            const { email } = req.body;
            await otpModel.deleteOne({ email });
            const otp = Math.floor(1000 + Math.random() * 9000);
            const mailOptions = {
                from: AUTH_MAIL,
                to: email,
                subject: 'OTP for registration is: ',
                html: `<p>votre code de verification est le suivant </p>
                <p style="color:tomato; font-size:25px;letter-spacing:2px"> <b>${otp}</b> </p><p>ce code <b> expire dans 1h</b></p>`
            }
            await sendEmail(mailOptions);
            const hashOtp = await hashData(otp);
            const newOtp = await otpModel.create({
                email,
                otp: hashOtp,
                createdAt: Date.now(),
                expirAt: Date.now() + 3600000

            })
            const creatOTPrecord = await newOtp.save();
            res.status(200).json({
                succes: true,
                message: "otp envoyé avec succes",
            })

            //send otp to use
        } catch (error) {
            res.status(500).json({
                succes: false,
                message: error.message
            })
        }
    }
    // verifi   otp
module.exports.verifyOtp = async(req, res) => {

    try {
        const { email, otp } = req.body;
        const otpData = await otpModel.findOne({ email });
        if (!otpData) {
            return res.status(400).json({
                succes: false,
                message: "otp not found"
            })
        }
        if (otpData.otp !== otp) {
            return res.status(400).json({
                succes: false,
                message: "otp not correct"
            })
        }
        if (otpData.expirAt < Date.now()) {
            return res.status(400).json({
                succes: false,
                message: "otp expired"
            })
        }
        res.status(200).json({
            succes: true,
            message: "otp verified"
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: error.message

        })
    }
}