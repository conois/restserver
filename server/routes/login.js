const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require('../config/config')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
//Importo mi modelo de usuario 
const Usuario = require('../models/usuario')
const app = express();

app.post('/login', (req, res) => {

    let body = req.body

    Usuario.findOne({
        email: body.email
        
    }, (err, usuarioBD) => {
        //si ocurre un error con el servidor
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        //si no encuentra un usuario, posiblemente anotó mal el correo o ese usuario no esta registrado
        if (!usuarioBD) {
            res.status(400).json({
                ok: false,
                err: {
                    message: "usuario o contraseña incorrecto"
                }
            })
        }

        if (!bcrypt.compareSync(body.password , usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "usuario o contraseña incorrecto"
                }
            })
        }

        let token = jwt.sign({
            usuario:usuarioBD
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN})

        res.json({
            ok: true,
            usuario: usuarioBD,
            token
        })

    })

})

//configuraciones de google 

async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    const objectToReturn = {
        nombre:  payload.name, 
        email: payload.email, 
        img: payload.picture,
        google: true
    }

    return objectToReturn
  }



app.post('/google', async (req, res) => {
    let token = req.body.idtoken

    let googleUser = await verify(token).catch( err => {
        return res.status(403).json({
            ok: false, 
            err: {
                message: "token no válido"
            }
        })
    })



    Usuario.findOne({email: googleUser.email}, (err, usuarioBD) => {
        if(err){
            return res.status(500).json({
                ok:false, 
                err
            })
        }

        if(usuarioBD){
            //Si existe usuario pero no se registró por google. 
            if(usuarioBD.google === false){
                return res.status(400).json({
                    ok:false, 
                    err: {
                        message: "Debe usar su autenticación normal"
                    }
                })
            }
            // Si existe y si se registró por google, tengo que renovar su token 
            else {
                let token = jwt.sign({usuario: usuarioBD}, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN})

                return res.json({
                    ok: true, 
                    usuario: usuarioBD,
                    token
                })
            }
        }
        // Si el usuario no existe en la base de datos, es la primera vez que se autentica usando google 
        else{
            let usuario = new Usuario ()

            usuario.nombre = googleUser.nombre
            usuario.email = googleUser.email
            usuario.img = googleUser.picture
            usuario.password = ":)"
            usuario.google = true 

            usuario.save( (err, usuarioBD) => {
                if (err){
                    return res.status(500).json({
                        ok: false, 
                        err
                    })
                }

                let token = jwt.sign({ usuario: usuarioBD}, process.env.SEED, { expiresIn : process.env.CADUCIDAD_TOKEN })

                return res.json({
                    ok:true,
                    usuario: usuarioBD, 
                    token
                })
            })
        }
    })
})


module.exports = app