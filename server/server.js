require('./config/config')
const express = require('express');
const app = express();
var bodyParser = require('body-parser')
// create application/x-www-form-urlencoded parser
// create application/json parser
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

app.get('/usuario', function (req, res) {
    res.json('get usuario');
});

app.post('/usuario', function (req, res) {
    let body = req.body
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            message: "nombre es requerido"
        })
    } else {
        res.json({
            body
        });
    }
});

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id
    res.json(id);
});

app.delete('/usuario/:id', function (req, res) {
    res.json('delete usuario');
});


//PUERTO 
app.listen(process.env.PORT , () => {
    console.log(`escuchando puerto ${process.env.PORT}`);
})