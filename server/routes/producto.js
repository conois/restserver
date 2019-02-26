const express = require('express')
let {
    verificaToken,
    verificaAdminRole
} = require('../middlewares/autenticacion')
let app = express()
let Producto = require('../models/producto')

//============ 
// Traer todas los productos 
// - populando, usuario y categoria 
// - paginado
//============
app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0
    let hasta = req.query.hasta || 10


    Producto.find({
            disponible: true
        })
        .populate('usuario categoria')
        .skip(desde)
        .limit(hasta)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Producto.count({
                disponible: true
            }, (err, count) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                res.json({
                    ok: true,
                    productos,
                    totalProductos: count
                })

            })


        })
})
//============ 
// Traer un producto 
// - populado y paginado 
//============
app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id

    Producto.findById(id)
        .populate('usuario categoria')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: "No existe ese producto"
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoBD

            })
        })
})

//============ 
// Buscar un producto
//============
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino
    let regex = new RegExp(termino, 'i')

    Producto.find({nombre: regex})
        .populate('categoria')
        .exec( (err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            
            if (!producto) {
                return res.status(201).json({
                    ok: true,
                    message: "no se encontró ningun producto con ese nombre"                    
                })
            }

            res.json({
                ok: true,
                producto
            })
        })
})


//============ 
// Crear un producto
// - Grabar el usuario
// - Grabar la categoria 
//============
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id,
    })

    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoBD
        })
    })

})
//============ 
// Actualizar un producto 
//============
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id
    let body = req.body

    Producto.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: true,
                err: {
                    message: "No se encuentra el producto en la base de datos"
                }
            })
        }

        res.json({
            ok: true,
            producto: productoBD
        })

    })
})
//============ 
// Borrar un producto un producto 
// - no borrar fisicamente si no cambiar el estado de disponible
//============

app.delete('/producto/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id

    Producto.findByIdAndUpdate(id, {
        disponible: false
    }, {
        new: true,
        runValidators: true
    }, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: true,
                err: {
                    message: "No se encuentra el producto en la base de datos"
                }
            })
        }

        res.json({
            ok: true,
            producto: productoBD
        })

    })
})

module.exports = app