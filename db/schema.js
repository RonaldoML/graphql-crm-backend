const { gql } = require('apollo-server');

//int, float, string, id, boolean

// Schema
const typeDefs = gql`

    type Usuario{
        id: ID
        nombre: String
        apellido: String
        email: String
        creado: String
    }
    
    type Producto{
        id: ID
        nombre: String
        existencia: Int
        precio: Float
        creado: String
    }

    type Cliente {
        id: ID
        nombre: String
        apellido: String
        empresa: String
        email: String
        telefono: String
        vendedor: ID
    }
    
    type Token {
        token: String
    }
    
    input UsuarioInput {
        nombre: String!
        apellido: String!
        email: String!
        password: String!
    }
    
    input ProductoInput {
        nombre: String!
        existencia: Int!
        precio: Float!
    }

    input AutenticarInput {
        email: String
        password: String
    }

    input ClienteInput {
        nombre: String!
        apellido: String!
        empresa: String!
        email: String!
        telefono: String
    }

    input PedidoProductoInput {
        
    }

    input PedidoInput {
        pedido: [PedidoProductoInput]
    }

    type Query {
        # Usuarios
        obtenerUsuario(token: String!) : Usuario
        
        # Productos
        obtenerProductos: [Producto]
        obtenerProducto( id: ID! ): Producto

        #Clientes
        obtenerClientes: [Cliente]
        obtenerClientesVendedor: [Cliente]
        obtenerCliente(id: ID!): Cliente
    }

    type Mutation {
        # Usuarios
        nuevoUsuario(input: UsuarioInput): Usuario
        autenticarUsuario(input: AutenticarInput): Token
    
        #Productos
        nuevoProducto(input: ProductoInput): Producto
        actualizarProducto( id: ID!, input: ProductoInput) : Producto
        eliminarProducto( id: ID! ) : String

        #Clientes
        nuevoCliente( input: ClienteInput ): Cliente
        actualizarCliente( id: ID!, input: ClienteInput ): Cliente
        eliminarCliente( id: ID! ): String

        #Pedidos
        nuevoPedido( input: PedidoInput ): Pedido
    }

`;

module.exports = typeDefs;