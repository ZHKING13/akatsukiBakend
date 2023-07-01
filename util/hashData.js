const bcrypt = require('bcryptjs');

const hashData = async(data) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedData = await bcrypt.hash(data, salt);
        return hashedData;
    } catch (error) {
        throw error;
    }
}

const verifyHashedData = async(data, hashedData) => {
    try {
        const isMatch = await bcrypt.compare(data, hashedData);
        return isMatch;
    } catch (error) {
        throw error;
    }
}

module.exports = { hashData, verifyHashedData };