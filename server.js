let config = require('./config.js');
let express = require('express');
let app = express();
var server = require('http').Server(app);
let io = require('socket.io')(server);
var mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
let morgan = require('morgan');
const PORT = process.env.PORT || 3500;
var stripe = require('stripe')(config.STRIPE_TEST_KEY);
var Charge = require('./models/Charge.js');

//cors options
// var whitelist = [
//     'http://localhost:3000',
//     'ec2-34-216-18-186.us-west-2.compute.amazonaws.com:3500',
//     'http://localhost:3500',
//     'ec2-34-216-18-186.us-west-2.compute.amazonaws.com'
// ];
// var corsOptions = {
//     origin: function(origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             console.log(origin);
//             callback(new Error('Not allowed by CORS'));
//         }
//     }
// };

//middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('combined'));

//socket-io event
io.on('connection', function(socket) {
	socket.on('dollarCountRequest', function(socket) {
		Charge.count(function(err, count) {
			if (err) {
				next(err);
			} else {
				io.emit('dollarCountTotal', {count});
			}
		});
	});
});

app.get('/', (req, res) => {
	res.send('Use /api for making requests to Dellar API');
});

app.post('/api/charge', (req, res, next) => {
	var token = req.body.stripeToken; // Using Express
	// Charge the user's card:
	stripe.charges.create(
		{
			amount: 100,
			currency: 'usd',
			description: 'Someone wasted a dollar.',
			source: token
		},
		function(err, charge) {
			if (err) {
				res.json(err);
			} else {
				let newCharge = new Charge({
					chargeId: charge.id,
					amount: charge.amount,
					source: charge.source,
					description: charge.description,
					paid: charge.paid
				});
				newCharge.save(function(err, savedCharge) {
					if (err) {
						next(err);
					} else {
						Charge.count(function(err, count) {
							if (err) {
								next(err);
							} else {
								io.emit('dollarCountTotal', {count});
							}
						});
						res.json(charge);
					}
				});
			}
		}
	);
});

app.get('/api/dollar_count', (req, res, next) => {
	Charge.count(function(err, count) {
		if (err) {
			next(err);
		} else {
			res.json({ count: count });
		}
	});
});

mongoose.connect(config.MONGO_DB_ENPOINT, function(err) {
	if (err) {
		throw err;
	}
	server.listen(PORT, () => {
		console.log('App is now running on port: ' + PORT);
	});
});
