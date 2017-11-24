let express = require('express');
let app = express();
let morgan = require('morgan');
const PORT = (process.env.PORT || 3500); 

app.use(morgan('combined'))

app.get('/', (req, res) => {
    res.json({"hello": "World"});
});

app.listen(PORT, ()=> {
    console.log('App is now running on port: ' + PORT)
})