import Router from 'express';
import mongoose from 'mongoose';
import {carritosModelo} from '../dao/models/carrito.models.js';
import {productosModelo} from '../dao/models/productos.models.js';

export const router = Router();

router.get('/chat', async(req, res) => {
    res.status(200).render('chat',{
        titulo:"Chat", estilo:"styles"
    })
});

router.get('/', async(req, res) => {
    let pagina=1
    let limite=10
    let disp=0
    let orden=0
    
    //declaramos los filtros que se agregaran y las opciones a incluir
    let filtro = {};
    let opciones = {
    lean: true,
    };

 
    if(req.query.pagina){
        try{
            pagina=parseInt(req.query.pagina)    
            opciones.page = pagina
        }
        catch(error){
            console.log(error.message);
        }
    }
    if(req.query.limit){
        
        try{
            limite=parseInt(req.query.limit)
            opciones.limit = limite   
        }
        catch(error){
            console.log(error.message);
        }
    }
    if(req.query.status){
    disp = req.query.status
        if(disp === 'true') {filtro.status = true }
        else if(disp === 'false'){filtro.status = false}
        else{}
    }
    if(req.query.sort){
        orden = req.query.sort
        if(orden === 'asc'){opciones.sort ={price:1} }
        else if (orden === 'desc'){opciones.sort = {price:-1}}
    }

    try{ 
        
        let product = await productosModelo.paginate(filtro, opciones)
        let {totalPages, hasNextPage, hasPrevPage, prevPage, nextPage}=product
        res.status(200).render('productos',{product:product.docs,
            totalPages, hasNextPage, hasPrevPage, prevPage, nextPage})
        }
        catch (error) {
            // si la promesa falla
            res.status(500).json({ error: 'Hubo un error al obtener los productos.' });
        }
    
});

router.get('/products', async(req, res) => {
    let pagina=1
    let limite=10
    let disp=0
    let orden=0

     //declaramos los filtros que se agregaran y las opciones a incluir
    let filtro = {};
    let opciones = {
    lean: true,
    };

    if(req.query.pagina){
        try{
            pagina=parseInt(req.query.pagina)    
            opciones.page = pagina
        }
        catch(error){
            console.log(error.message);
        }
    }
    if(req.query.limit){
        
        try{
            limite=parseInt(req.query.limit)
            opciones.limit = limite   
        }
        catch(error){
            console.log(error.message);
        }
    }
    if(req.query.status){
    disp = req.query.status
        if(disp === 'true') {filtro.status = true }
        else if(disp === 'false'){filtro.status = false}
        else{}
    }
    if(req.query.sort){
        orden = req.query.sort
        if(orden === 'asc'){opciones.sort ={price:1} }
        else if (orden === 'desc'){opciones.sort = {price:-1}}
    }

    try{ 
        
        let product = await productosModelo.paginate(filtro, opciones)
        let {totalPages, hasNextPage, hasPrevPage, prevPage, nextPage}=product
        res.status(200).render('products',{product:product.docs,
            totalPages, hasNextPage, hasPrevPage, prevPage, nextPage})
        }
        catch (error) {
            // si la promesa falla
            res.status(500).json({ error: 'Hubo un error al obtener los productos.' });
        }
    
});


router.get('/carts/:cid', async(req, res) => {
    
    try{ 
        //leemos el id ingresado y lo parseamos a entero
        let id=req.params.cid;
        if(!mongoose.Types.ObjectId.isValid(id)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ingrese un id válido...!!!`})
        }

            //en caso de que sea numero procedemos a buscar el id
            let carrito = await carritosModelo.findOne({deleted:false, _id:id}).populate('productos.idProducto').lean();
            
            if(carrito){
                 res.status(200).render('carrito',{carrito})
                
            }
        else{
            //si no se pudo convertir el numero, devolvemos error
            return res.status(400).json({ error: 'Id no encontrado' });
        }
        
    }
    catch (error) {
            // si la promesa falla
            return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message})
    }
    
    
});




 




