const express = require('express');
const Boat = require('../models/boatModel')
const boatRouter = express.Router();

boatRouter.route('/assets')
	.get((req, res) => {

	})
boatRouter.route('/search')
	.get((req, res) => {
		
		let query = {};
		if(req.query.word)
		query.modelName = req.query.word;
		if(req.query.maxprice)
		query.price = req.query.maxprice;
		if(req.query.madebefore)
		query.madebefore = req.query.madebefore
		if(req.query.madeafter)
		query.madeafter = req.query.madeafter
		let orders = {}
		if(req.query.has_motor){
			if(req.query.has_motor === 'yes'){
				query.motor = true
			}else if(req.query.has_motor === 'no'){
				query.motor = false
			}
		}
		if(req.query.is_sail){
			if(req.query.is_sail === 'yes'){
				query.sailBoat = true
			}else if(req.query.is_sail === 'no'){
				query.sailBoat = false
			}
		}
		if(req.query.order){
			if(req.query.order === 'lowprice'){
				orders.price = -1
			}
			if(req.query.order === 'name_asc'){
				orders.modelName = 1
			}
			if(req.query.order === 'name_desc'){
				orders.modelName = -1
			}
			if(req.query.order === 'oldest'){
				orders.year = -1
			}
			if(req.query.order === 'newest'){
				orders.year = 1
			}
		}
		Boat.find({ $and: [ { modelName: { $regex: new RegExp(query.modelName, "i") } }, { motor: { $eq: query.motor } }, { sailBoat: { $eq: query.sailBoat } }, { price: { $lte: query.price } }, { year: { $lte: query.madebefore } }, { year: { $gte: query.madeafter } } ] }.sort(orders).limit(5), function (err, filter) {
			if(err) res.status(500).send(err)
			if(filter.length === 0) res.status(404).send(query.has_motor)
			else res.status(200).json(filter)
		});
	})

boatRouter.route('/boats')
    .get((req,res) => {
		Boat.find({}, (err, boats) => {
			if(err) res.status(500).send(err)

			else res.status(200).json(boats)
		})
	})
boatRouter.post('/boat',async (req, res, next) => {
	let currentId = await Boat.find().sort({ id: -1 }).limit(1);
	let nextId = currentId + 1
	req.nextId = nextId
	next()
})
boatRouter.route('/boat')
	.post(async(req, res) => {
		req.body.id = req.nextId
		let boat = new Boat(req.body)
		try{
			await boat.save();
			res.status(201).send(boat)
		}catch(err){
			res.status(400).json({message: err.message})
		}
	})
	boatRouter.use('/boat/:id', (req, res, next)=>{
		Boat.findById( req.params.id, (err,boat)=>{
			if(err)
				res.status(500).send(err)
			else {
				console.log('middlewere first');
				req.boat = boat;
				next()
			}
		})
	
	})

boatRouter.route('/boat/:id')
	.get((req, res) => {
		res.json(req.boat)
	})
	.put((req, res) => {
		
			req.boat.modelName = req.body.modelName
			req.boat.year = req.body.year
			req.boat.price = req.body.price
			req.boat.sailBoat = req.body.sailBoat
			req.boat.motor = req.body.motor
			req.boat.picURL = req.body.picURL
			req.boat.save()
			res.json(req.boat)
	})
	.delete((req, res) => {
		
			req.boat.remove(err => {
				if(err){
					res.status(500).send(err)
				}
				else{
					res.status(204).send('Boat removed')
				}
			})
		
	})
	.patch((req,res)=>{
        
            if(req.body._id){
                delete req.body._id;
            }
            for( let p in req.body ){
                req.boat[p] = req.body[p];
            }
            req.boat.save();
            res.json(req.boat);
    })
module.exports = boatRouter;
