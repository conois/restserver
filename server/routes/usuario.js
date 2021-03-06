const express = require('express');
const _ = require('underscore')
const bcrypt = require('bcrypt')
//Importo mi modelo de usuario 
const Usuario = require('../models/usuario')
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')
const app = express();


app.get('/usuarios', verificaToken , (req, res) => {

    let desde = req.query.desde || 0
    desde = Number(desde)
    let hasta = req.query.hasta || 5
    hasta = Number(hasta)

    Usuario.find({estado:true})
        .skip(desde)
        .limit(hasta)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.count({estado:true}, (err, count) => {
                res.json({
                    ok: true,
                    usuarios,
                    totalRegistro: count
                });

            })


        })
});

app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })


    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })
});

app.put('/usuario/:id', [verificaToken, verificaAdminRole],  (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'email', 'role', 'img', 'estado'])

    Usuario.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })
});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id

    //Eliminar de la base de datos 
    /* Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!usuarioBorrado){
            res.json({
                ok: false,
                err: {
                    message: "El usuario no existe en la base de datos"
                }
            });
        }

        res.json({
            ok:true, 
            usuario: usuarioBorrado
        })
    }) */

    Usuario.findByIdAndUpdate(id, {estado:false}, {new: true, runValidators: true}, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok:true, 
            usuario: usuarioBorrado
        })
        
    })
});


module.exports = app