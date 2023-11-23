const Router = require('express');
const Productos = require('../clases/productos'); // Cambiado el nombre a Productos
const productoM = new Productos("../archivos/archivo.txt");

const router = Router();

// io.on("connection",socket=>{
//     socket.emit("get", { emisor:"server",mensaje:"hola" }); // Ejemplo de uso de io.emit
// })

router.get('/', async(req, res) => {
    let listaProductos = await productoM.getProducts(); // Cambiado el nombre a listaProductos
    res.status(200).render('home', {listaProductos}); // Cambiado el nombre a listaProductos
});

router.get('/realtimeproducts', async(req, res) => {

    res.status(200).render('realtimeproducts'); // Cambiado el nombre a listaProductos
});


module.exports = router;



