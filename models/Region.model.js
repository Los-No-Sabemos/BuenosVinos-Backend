const mongoose = require('mongoose')

const RegionSchema = new mongoose.Schema({
    country: {type: String, required: true},
    region: {type: String, required: true}
})


module.exports = mongoose.model('Region', RegionSchema);