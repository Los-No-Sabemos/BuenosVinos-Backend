const mongoose = require('mongoose')

const RegionSchema = new mongoose.Schema({
    
    region: {type: String, required: true},
    country: {type: String, required: true},
   
})


module.exports = mongoose.model('Region', RegionSchema);