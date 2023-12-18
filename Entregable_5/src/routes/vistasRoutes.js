import Router from 'express';
// const Productos = require('../clases/productos'); // Cambiado el nombre a Productos
// const productoM = new Productos("../archivos/archivo.txt");

export const router = Router();

router.get('/chat', async(req, res) => {
    res.status(200).render('chat',{
        titulo:"Chat", estilo:"styles"
    })
});

 




