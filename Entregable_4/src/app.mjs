
const express = require('express');
const {engine} = require ('express-handlebars');
const path = require('path');
const {Server} = require('socket.io')
const Productos = require('./clases/productos.js'); // Cambiado el nombre a Productos
const productoM = new Productos("../archivos/archivo.txt");

//aqui comienza el programa del servidor con express
const routerProduct=require('./routes/productsRoutes.js')
const routerVistas=require('./routes/vistasRoutes.js')


const PORT = 9000;
const app = express();

const server = app.listen(PORT, () => { //se le pone server
    console.log(`Server escuchando en puerto ${PORT}`)
});

const io = new Server(server) // se le coloca io

io.on("connection",async socket=>{
    let productos = await productoM.getProducts()
    socket.emit("get", { productos }); // Ejemplo de uso de io.emit
})

module.exports = { io, app };

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"/public")))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use('/api/products', routerProduct)
app.use('/', routerVistas)


