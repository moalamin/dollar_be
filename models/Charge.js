mongoose = require('mongoose');

let chargeSchema = mongoose.Schema({
    chargeId: String,
    amount: Number,
    source: mongoose.Schema.Types.Mixed,
    description: String,
    paid: Boolean
})

let Charge = mongoose.model('Charge', chargeSchema);

module.exports = Charge;