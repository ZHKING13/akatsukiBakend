const jwt = require("jsonwebtoken")
const { TOKEN_KEY } = process.env
const userModel = require("../../Models/user")


module.exports.isAdmin = async(req, res, next) => {

    try {
        const { token } = req.cookies;
        const decoded = jwt.verify(token, TOKEN_KEY)

        req.user = decoded

        const user = await userModel.findOne({ _id: decoded._id, isAdmin: true })
            .select("-password")

        if (!user) {
            // if not admin
            return res.send("Insufficient User Permissions")
        }

        // if admin, pass to the next function call
        return next()

    } catch (error) {
        return res.status(401).json({ msg: "Invalid User Auth Token", err: error.message });
    }
}


module.exports.checkAuth = async(req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({
                message: "please login first"
            });
        }
        const decoded = await jwt.verify(token, process.env.TOKEN_KEY);
        req.user = await userModel.findById(decoded._id);
        next();
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: error.message

        })
    }
}