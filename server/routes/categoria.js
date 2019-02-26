const express = require('express')
let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')
let app = express()
let Categoria = require('../models/categoria')

//============ 
// Traer todas las categorias 
//============

app.get('/categoria', verificaToken,  (req, res) => {

    Categoria.find({})
            .sort('descripcion')
            .populate('usuario', 'nombre email')
            .exec( (err, categorias) => {
                if(err){
                    return res.status(500).json({
                        ok:false, 
                        err
                    })
                }

                res.json({
                    ok: true, 
                    categorias
                })
            })

})

//============ 
// Traer una categoria 
//============

app.get('/categoria/:id', (req, res) => {

    let id = req.params.id 

    Categoria.findById(id, (err, categoria) => {
        if(err){
            return res.status(500).json({
                ok:false, 
                err
            })
        }

        res.json({
            ok: true, 
            categoria
        })
    })

})

//============ 
// Crear nueva categoria  
//============

app.post('/categoria', verificaToken, (req, res)  => {
    //regresa una nueva categoria
    // req.usuario._id
    let body = req.body

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save( (err, categoriaBD) => {
        if(err){
            return res.status(500).json({
                ok:false, 
                err
            })
        }

        res.json({
            ok:true, 
            categoria: categoriaBD
        })

    })
})

//============ 
// Actualizar nueva categoria  
//============

app.put('/categoria/:id', verificaToken, (req, res)  => {
    //actualiza la descripcion de la categoría 
    let id = req.params.id
    let body = req.body

    Categoria.findByIdAndUpdate( id, {descripcion: body.descripcion}, {runvalidators: true, new: true},  (err, categoriaBD) => {
        if(err){
            return res.status(500).json({
                ok:false, 
                err
            })
        }

        if(!categoriaBD){
            return res.status(400).json({
                ok:false, 
                err
            })
        }

        res.json({
            ok: true, 
            categoria: categoriaBD
        })

    })
})

//============ 
// Elimina nueva categoria  
//============

app.delete('/categoria/:id', [verificaToken, verificaAdminRole] , (req, res)  => {
    //elimina definitivamente la categoría
    //Solo un administrador puede borrar la categoria

    let id = req.params.id

    Categoria.findByIdAndRemove( id, (err, categoriaBorrada) => {
        if(err){
            return res.status(500).json({
                ok:false, 
                err
            })
        }

        if(!categoriaBorrada){
            return res.status(400).json({
                ok:false, 
                err:{
                    message: "La categoría indicada no se encuentra en la base de datos"
                }
            })
        }
        res.json({
            ok: true, 
            message: "Categoria borrada con éxito"
             
        })
    })

})


module.exports = app