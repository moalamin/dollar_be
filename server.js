let express = require('express');
let app = express();
let morgan = require('morgan');
const PORT = (process.env.PORT || 3500); 

app.use(morgan('combined'))

app.get('/', (err, req, res, next) => {
    if (err) {
        next(error)
    }
    res.send({hello: "World"});
});

app.listen(PORT, ()=> {
    console.log('App is now running on port: ' + PORT)
})