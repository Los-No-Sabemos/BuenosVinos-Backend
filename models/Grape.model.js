const mongoose = require('mongoose');

const GrapeSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: String
});

module.exports = mongoose.model('Grape', GrapeSchema);