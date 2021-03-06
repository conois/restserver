
// =========== 
// PUERTO 
// ===========

process.env.PORT = process.env.PORT || 1234

// ============= 
// ENTORNO
// =============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'
// ============= 
// CLIENT_ID_GOOGLE
// =============

process.env.CLIENT_ID = process.env.CLIENT_ID || "922575093822-gj7irb023tfv0o7o59dcioudjjdcjgq1.apps.googleusercontent.com"

// ============= 
// VENCIMIENTO TOKEN
// =============

process.env.CADUCIDAD_TOKEN = 60*60*24*30

// ============= 
// SEED  
// =============

process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo'

// ============= 
// BASE DE DATOS 
// =============

let urlDB

 if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
}
else {
    urlDB = process.env.MONGO_URI
} 

process.env.URLDB = urlDB
