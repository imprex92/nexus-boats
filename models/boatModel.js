const { Decimal128 } = require('mongodb');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const boatModel = new Schema({
	id: { type: Number },
	modelName: { type: String, required: true},
	year: { type: Number, required: true},
	price: { type: Decimal128, required: true},
	sailBoat: { type: Boolean, required: true},
	motor: { type: Boolean, required: true},
	picURL: { type: String, required: true},
})
module.exports = mongoose.model('_boatproject', boatModel)