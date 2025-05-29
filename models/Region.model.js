const mongoose = require('mongoose')

const RegionSchema = new mongoose.Schema({
    
    region: {type: String, required: true},
    country: {type: String, required: true},
    description: {type: String, required: true},
    climate: {type: String, required: true},
    signatureWine: {type: String, required: true},
    history: {type: String, required: true},
    bestTimeToVisit: {type: String, required: true},
    wineFestivals: {type: String, required: true},
    image: {type: String, required: true},
    map: {type: String, required: true},
   
})


module.exports = mongoose.model('Region', RegionSchema);