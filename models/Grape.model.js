const mongoose = require('mongoose');

const GrapeSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    origin: {type: String, required: true},
    yearFirstCultivated: {type: String, required: true},
    color: {type: String, required: true},
    acidity: {type: String, required: true},
    flavorProfile: {type: String, required: true},
    aroma:  {type: String, required: true},
    foodPairing: {type: String, required: true},
    popularWines: { type: mongoose.Schema.Types.ObjectId, ref: 'Wine', required: true },
    servingTemperature: {type: String, required: true},
    imageGrape: {type: String, required: true},
    imageWineGlass: {type: String, required: true},
});

module.exports = mongoose.model('Grape', GrapeSchema);