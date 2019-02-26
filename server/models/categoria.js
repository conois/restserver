const mongoose = require ('mongoose')

const Schema = mongoose.Schema

/* Una categoría corresponderá a la clasificación de los productos que tenemos en la cafeteria 
Pueden ser por ejemplo: bebidas frias, bebidas calientes, postres, dulces, cenas, ensaladas. 
Cada categoria tendra una descripcion ( bebida caliente, bebida fria ...) y el usuario que la creo, 
esta información del usuario se tiene que llenar desde la otra colección */


let categoriaSchema = new Schema({
    descripcion:{
        type: String, 
        unique: true, 
        required: true,
    }, 
    usuario: {
        type: Object, 
        ref: 'Usuario'
    }
})

module.exports = mongoose.model('Categoria', categoriaSchema)