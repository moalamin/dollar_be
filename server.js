let config = require('./config.js');
let express = require('express');
let app = express();
let cors = require('cors');
let bodyParser = require('body-parser');
let morgan = require('morgan');
const PORT = process.env.PORT || 3500;
var stripe = require('stripe')(config.STRIPE_TEST_KEY);

//cors options
var whitelist = [
    'http://localhost:3000',
    'ec2-34-216-18-186.us-west-2.compute.amazonaws.com:3500',
    'http://localhost:3500',
    'ec2-34-216-18-186.us-west-2.compute.amazonaws.com'
];
var corsOptions = {
    origin: function(origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log(origin);
            callback(new Error('Not allowed by CORS'));
        }
    }
};

//middleware
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('combined'));

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
            description: 'Someone waster a dollar.',
            source: token
        },
        function(err, charge) {
            if (err) {
                next(err);
            } else {
                res.json(charge);
            }
        }
    );
});

app.listen(PORT, () => {
    console.log('App is now running on port: ' + PORT);
});
