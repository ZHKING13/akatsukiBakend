const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const demandeVipSchema = new Schema({
    email: {
        type: String,
        require: true,
    },
    numero: {
        type: String,
        require: true,
    }

})

const demandeVipModel = mongoose.model('demandeVerification', demandeVipSchema);
module.exports = demandeVipModel;