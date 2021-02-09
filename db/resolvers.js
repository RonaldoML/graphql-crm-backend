const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente');

const crearToken = require('../helpers/token');


//Base de datos


// Resolvers
const resolvers = {
    Query: {

        //Usuarios
        obtenerUsuario: async (_, { token }) => {
            const usuarioId = await jwt.verify(token, process.env.SECRETA);
            return usuarioId;
        },

        //Productos
        obtenerProductos: async () => {
            try {

                const productos = await Producto.find({});

                return productos;

            } catch (error) {
                console.log(error);
            }
        },

        obtenerProducto: async (_, { id }) => {
            //revisar si el producto existe
            const producto = await Producto.findById(id);

            if (!producto) {
                throw new Error('Producto no encontrado')
            }
            return producto;
        },

        //Clientes
        obtenerClientes: async() => {
            try {
                
                const clientes = await Cliente.find({});

                return clientes;

            } catch (error) {
                console.log(error)
            }
        },

        obtenerClientesVendedor: async( _, {}, ctx ) => {
            try {
                
                console.log(ctx.usuario.id.toString());
                const clientes = await Cliente.find({ vendedor: ctx.usuario.id.toString() });

                return clientes;

            } catch (error) {
                console.log(error)
            }
        },

        obtenerCliente: async( _, { id }, ctx ) => {
            //Revisar si existe
            const cliente = await Cliente.findById(id);

            if(!cliente){
                throw new Error('No existe el cliente');
            }

            //Quien puede verlo
            if(cliente.vendedor.toString() !== ctx.usuario.id){
                throw new Error('No tienes las credenciales');
            }

            return cliente;
        }

    },
    Mutation: {
        //Usuarios
        nuevoUsuario: async (_, { input }) => {

            const { email, password } = input;

            // Revisar si el usuario ya está registrado
            const existeUsuario = await Usuario.findOne({ email });

            if (existeUsuario) {
                throw new Error(' El usuario ya está registrado ');
            }

            //Hacer hash del password
            const salt = await bcrypt.genSalt();
            input.password = await bcrypt.hash(input.password, salt);

            //Guardar en la db
            try {

                const usuario = new Usuario(input);

                const usuarioCreado = await usuario.save(); //Guardarlo

                return usuarioCreado;

            } catch (error) {
                console.log(error);
            }

        },

        autenticarUsuario: async (_, { input }) => {

            const { email, password } = input;

            //Si el usuario existe
            const existeUsuario = await Usuario.findOne({ email });

            if (!existeUsuario) {
                throw new Error('El usuario no existe');
            }

            //Revisar si el password existe
            const passwordCorrecto = await bcrypt.compare(password, existeUsuario.password);

            if (!passwordCorrecto) {
                throw new Error('El password es incorrecto')
            }

            //Generar el token

            return {
                token: crearToken(existeUsuario, process.env.SECRETA)
            }
        },

        //Productos
        nuevoProducto: async (_, { input }) => {

            try {
                const producto = new Producto(input);

                //almacenar en la db
                const resultado = await producto.save();

                return resultado;

            } catch (error) {
                console.log(error);
            }

        },

        actualizarProducto: async (_, { id, input }) => {

            try {

                //Revisar si existe
                let producto = await Producto.findById(id);

                if (!producto) {
                    throw new Error('El prodcuto no existe');
                }

                //guardar en la db
                producto = await Producto.findByIdAndUpdate({ _id: id }, input, { new: true });

                return producto;

            } catch (error) {
                console.log(error);
            }
        },

        eliminarProducto: async (_, { id }) => {
            try {

                //Revisar si existe
                let producto = await Producto.findById(id);

                console.log(producto)

                if (!producto) {
                    throw new Error('El producto no existe');
                }

                //guardar en la db
                producto = await Producto.findByIdAndDelete({ _id: id });

                return "Producto eliminado.";

            } catch (error) {
                console.log(error);
            }
        },

        //Clientes
        nuevoCliente: async (_, { input }, ctx) => {

            console.log(ctx);
            //Verificar si el cliente está registrado
            const { email } =  input;

            const cliente = await Cliente.findOne({email});

            if(cliente){
                throw new Error('El cliente ya se encuentra registrado')
            }

            const nuevoCliente = new Cliente(input);

            //asignar el vendedor
            nuevoCliente.vendedor = ctx.usuario.id;

            //guardarlo en la db

            try {
                
                const resultado = await nuevoCliente.save();
    
                return resultado;

            } catch (error) {
                console.log(error);
            }

        },

        actualizarCliente: async ( _, { id, input }, ctx) => {

            //verificar si existe
            let cliente = await Cliente.findById(id);

            if(!cliente){
                throw new Error('El cliente no existe');
            }

            //Verificar si el vendedor es el que edita
            if(cliente.vendedor.toString() !== ctx.usuario.id){
                throw new Error('No tienes las credenciales');
            }

            //guardar el cliente
            cliente = await Cliente.findOneAndUpdate({_id: id}, input, {new:true});

            return cliente;

        },
        eliminarCliente: async ( _, {id}, ctx) => {
            //verificar si existe
            let cliente = await Cliente.findById(id);

            if(!cliente){
                throw new Error('El cliente no existe');
            }

            //Verificar si el vendedor es el que edita
            if(cliente.vendedor.toString() !== ctx.usuario.id){
                throw new Error('No tienes las credenciales');
            }

            //guardar el cliente
            cliente = await Cliente.findOneAndDelete({_id: id});

            return "Cliente eliminado";
        }
    }
}

module.exports = resolvers;