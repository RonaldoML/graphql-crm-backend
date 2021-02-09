
const { ApolloServer, gql } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');

const conectarDB = require('./config/db');
const jwt = require('jsonwebtoken');

//Conexión db
conectarDB();

//Schema


//Base de datos


// Resolvers


// Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ( {req} ) => {
        // console.log(req.headers['authorization']);

        const token = req.headers['authorization'] || '';
        if(token){
            try {
                
                const usuario = jwt.verify( token, process.env.SECRETA );
                console.log(usuario);
                
                //pasamos el usaurio en el context
                return{
                    usuario
                }

            } catch (error) {
                console.log(error);
            }
        }
    }
});

//Levantar el servidor
server.listen().then( ({ url }) => {
    console.log(`Servidor corriendo en la URL: ${ url }`);
} ).catch( error => console.log(error) );
 