import express from 'express';
import {engine} from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import {Server} from 'socket.io';
import sessions from 'express-session'
import mongoStore from 'connect-mongo'
import crypto from 'crypto'
import {messageModelo} from './dao/models/message.models.js' 


// const Productos = require('./clases/productos.js'); // Cambiado el nombre a Productos
// const productoM = new Productos("../archivos/archivo.txt");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//aqui comienza el programa del servidor con express
import {prodRouter} from './routes/productsRoutes.js';
import {carrRouter} from './routes/carritoRoutes.js';
import {router as vistasRoutes} from './routes/vistasRoutes.js';
import {router as sessionRoutes} from './routes/sessionRoutes.js';

const PORT = 9000;
const app = express();

app.use(sessions(
    {
        secret:"codercoder123",
        resave: true, saveUninitialized: true,
        store: mongoStore.create(
            {
                mongoUrl:'mongodb+srv://backend1995:backend1995@cluster0.di15dhz.mongodb.net/ecommerce?retryWrites=true&w=majority',
                mongoOptions:{dbName:"ecommerce"},
                ttl:3600
            }
        )
    }
))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"/public")))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use('/api/products', prodRouter)
app.use('/api/carts', carrRouter)
app.use('/api/sessions', sessionRoutes)
app.use('/', vistasRoutes)


const server = app.listen(PORT, () => { //se le pone server
    console.log(`Server escuchando en puerto ${PORT}`)
});

async function conectarBaseDeDatos() {
    try {
        await mongoose.connect("mongodb+srv://backend1995:backend1995@cluster0.di15dhz.mongodb.net/ecommerce?retryWrites=true&w=majority");
        console.log("DB conectada");
    } catch (error) {
        console.error(error.message);
    }
}

// Llamar a la función asíncrona
conectarBaseDeDatos();

let usuarios=[]
let mensajes=[]

const io = new Server(server) // se le coloca io


io.on("connection", async socket=>{
    console.log(`Se ha conectado un cliente con id ${socket.id}`)

    socket.on('id',nombre=>{

       usuarios.push({nombre, id:socket.id})
        socket.broadcast.emit('nuevoUsuario',nombre)
        socket.emit("hello",mensajes)
    })

    socket.on('mensaje', async datos=>{
        const email = datos.emisor;
        const mensaje = datos.mensaje;
        io.emit('nuevoMensaje', datos)
        console.log({email,mensaje});
        try {
            let nuevoMensaje=await messageModelo.create({email,mensaje})
            console.log(`Mensaje y usuario creados con exito: ${nuevoMensaje}`);
        } catch (error) {
            console.log(`Error al crear el usuario y mensaje${error.mensaje}`);
                }

    })

    socket.on("disconnect",()=>{
        let usuario=usuarios.find(u=>u.id===socket.id)
        if(usuario){
            io.emit("usuarioDesconectado", usuario.nombre)
        }
    })

})






