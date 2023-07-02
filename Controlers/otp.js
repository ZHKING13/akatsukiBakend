const otpModel = require('../Models/Otp');
const { hashData, verifyHashedData } = require('../util/hashData');
const sendEmail = require('../util/sendMail');
const { AUTH_MAIL } = process.env
    //sned otp to user email
module.exports.sendOtp = async(req, res) => {

        try {
            const { email } = req.body;
            await otpModel.deleteOne({ email });
            const otp = `
            ${Math.floor(1000 + Math.random() * 9000)}
            `;
            const mailOptions = {
                from: AUTH_MAIL,
                to: email,
                subject: 'OTP de verification: ',
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
                newOtp
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
        if (!email || !otp) {
            return res.status(400).json({
                succes: false,
                message: "email et otp sont obligatoire"
            })
            const matchOtp = await otpModel.findOne({ email })
            if (!matchOtp) {
                return res.status(400).json({
                    succes: false,
                    message: "aucun OTP  trouver pour cet email"
                })
            }
            const { expirAt } = matchOtp;
            if (Date.now() > expirAt) {
                await otpModel.deleteOne({ email })
                return res.status(400).json({
                    succes: false,
                    message: "OTP expiré"
                })
            }
            const valideOtp = await verifyHashedData(otp, matchOtp.otp);
            if (!valideOtp) {
                return res.status(400).json({
                    succes: false,
                    message: "OTP invalide"
                })
            }
            return res.status(200).json({
                succes: true,
                message: "OTP valide"
            })
        }
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: error.message

        })
    }
}