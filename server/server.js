require('./config/config')
const express = require('express');
const mongoose = require('mongoose') 
const bodyParser = require('body-parser')
const app = express();
const path = require('path')
// Para rescatar el body en post, put y delete. 
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

//creo mi middleware para mis peticiones http
app.use( require ('./routes/index'))

//Dejando publica mi carpeta public. 
app.use( express.static(path.resolve(__dirname, '../public')))
//====CONEXION MONGOOSE===
mongoose.connect(process.env.URLDB, {useNewUrlParser: true} , (err, res)=> {
    if (err) throw err 

    console.log("Base de datos ONLINE");
});

//====PUERTO====== 
app.listen(process.env.PORT , () => {
    console.log(`escuchando puerto ${process.env.PORT}`);
})