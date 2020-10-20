const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const SaveTemplateSchema = mongoose.Schema({
    bankName: {
        type: String,
        required: true,
        unique:true,
        uniqueCaseInsensitive: true
    },
    modifiedBy: {
        type: String,
        required: true,
    },
    modifiedDate: {
        type: String,
        required: true,
    }
}).plugin(uniqueValidator,{
    message:'Error bankName already exsit'
});

var bankModel =  mongoose.model('bankModel', SaveTemplateSchema);

module.exports = bankModel ;