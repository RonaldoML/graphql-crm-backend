const jwt = require('jsonwebtoken');

const crearToken = ( usuario, secretword, expiresIn = '24h' ) => {
    
    const { id, email, nombre, apellido} = usuario;

    return jwt.sign({ id, email, nombre, apellido }, secretword, { expiresIn })

}

module.exports = crearToken;