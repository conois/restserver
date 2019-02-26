const jwt = require('jsonwebtoken')
// ================== 
// VERIFICAR TOKEN 
// ================== 


let verificaToken = (req, res, next) => {
    let token = req.get('token') // nombre con que envié en el header

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario
        next()

    })

}

// ================== 
// VERIFICAR ADMIN_ROLE 
// ================== 

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario

    if (usuario.role === "ADMIN_ROLE") {
        next()
    } else {
        return res.json({
            ok: false,
            err: {
                message: "usuario sin permisos para esta petición"
            }
        })
    }
}

module.exports = {
    verificaToken,
    verificaAdminRole
}