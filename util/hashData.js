const bcrypt = require('bcrypt');

const hashData = async(data, saltRound = 10) => {
    try {
        const hashedData = await bcrypt.hash(data, saltRound);
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