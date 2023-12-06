
const express = require('express');
const {engine} = require ('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const {Server} = require('socket.io')
const Productos = require('./clases/productos.js'); // Cambiado el nombre a Productos
const productoM = new Productos("../archivos/archivo.txt");

//aqui comienza el programa del servidor con express
const routerProduct=require('./routes/productsRoutes.js')
const routerVistas=require('./routes/vistasRoutes.js')


const PORT = 9000;
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"/public")))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use('/api/products', routerProduct)
app.use('/', routerVistas)


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



const io = new Server(server) // se le coloca io
io.on("connection",async socket=>{
    let productos = await productoM.getProducts()
    socket.emit("get", { productos }); // Ejemplo de uso de io.emit

    socket.on("addProduct",async producto=>{
        let prodN = JSON.parse(producto)
        if (prodN.status == "1"){prodN.status = true}
        else{prodN.status = false}
        if(prodN.thumbnails == ""){prodN.thumbnails = []}
    prodN.stock = parseInt(prodN.stock);
    prodN.price = parseInt(prodN.price);
    prodN.thumbnails = [prodN.thumbnails]
    console.log(prodN);
    
         let ok = await productoM.validacion(prodN.title,prodN.description,prodN.code,prodN.price,prodN.status,prodN.stock,prodN.category,prodN.thumbnails)
             if(ok){
                if(await productoM.addProduct(prodN.title,prodN.description,prodN.code,prodN.price,prodN.status,prodN.stock,prodN.category,prodN.thumbnails)){
                    productos = await productoM.getProducts()
                    io.emit("get", { productos }); 
                 }
             }
            else{
                io.emit("error", { error: 'Verifique de no enviar propiedades adicionales o campos vacíos' }); // Ejemplo de uso de io.emit
         }
                
        
        
    })
    
})






