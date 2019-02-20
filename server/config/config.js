
// =========== 
// PUERTO 
// ===========

process.env.PORT = process.env.PORT || 1234

// ============= 
// ENTORNO
// =============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// ============= 
// BASE DE DATOS 
// =============

let urlDB

 if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
}
else {
    urlDB ='mongodb://admin:abc123@ds123635.mlab.com:23635/cafe'
} 

process.env.URLDB = urlDB
