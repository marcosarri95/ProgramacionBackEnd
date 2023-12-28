import prodRou from 'express';
import {productosModelo} from '../dao/models/productos.models.js';
import mongoose from 'mongoose';
export const prodRouter = prodRou();

prodRouter.use(prodRou.json())
prodRouter.use(prodRou.urlencoded({extended:true}))

async function validacionNulos(producto){
    if(!title || !description || !code || !price || !stock || !category){
        //si los campos estan vacios, devolvemos false
        return false;
    }
    else{
        return true;
    }
}

async function validacionTipoDatoP(producto){
    const errors = {};

    // Verificar cada propiedad que el cliente envía para modificar
    if (producto.title && typeof producto.title !== 'string') {
      errors.title = 'El título debe ser una cadena de texto';
    }
  
    if (producto.description && typeof producto.description !== 'string') {
      errors.description = 'La descripción debe ser una cadena de texto';
    }
  
    if (producto.code && typeof producto.code !== 'string') {
      errors.code = 'El código debe ser una cadena de texto';
    }
  
    if (producto.price && typeof producto.price !== 'number') {
      errors.price = 'El precio debe ser un número';
    }
  
    if (producto.status && typeof producto.status !== 'boolean') {
      errors.status = 'El estado debe ser un valor booleano';
    }
  
    if (producto.stock && typeof producto.stock !== 'number') {
      errors.stock = 'El stock debe ser un número';
    }
  
    if (producto.category && typeof producto.category !== 'string') {
      errors.category = 'La categoría debe ser una cadena de texto';
    }
  
    if (producto.thumbnails && !Array.isArray(producto.thumbnails)) {
      errors.thumbnails = 'Las miniaturas deben ser un array';

    }
  
    return errors;
            }


prodRouter.get('/:pid',async (req,res)=>{
    try{ 
        //leemos el id ingresado y lo parseamos a entero
        let id=req.params.pid;
        console.log(id);
        if(!mongoose.Types.ObjectId.isValid(id)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ingrese un id válido...!!!`})
        }
            //en caso de que sea numero procedemos a buscar el id
            let product = await productosModelo.findOne({deleted:false, _id:id});
            if(product){
                res.setHeader('Content-Type','application/json');
                 res.status(200).json(product);
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

        
})

 
prodRouter.get('/',async(req,res)=>{
    try{ 
        let product = await productosModelo.find({deleted:false});
        let nQuery = []
        let limite = parseInt(req.query.limit)
            if(limite <= product.length){
                //si el limite es menor al que tiene el vector de productos
                //mostramos la cantidad solicitada
                nQuery = product.splice(0,limite)
             }
            else{
                //si el limite es mayor, o no se ingreso un limite, mostramos todos los productos
                nQuery = product
            }
            
                res.setHeader('Content-Type','application/json');
                res.status(200).json(nQuery);
        }
        catch (error) {
            // si la promesa falla
            res.status(500).json({ error: 'Hubo un error al obtener los productos.' });
        }

    
})

prodRouter.post('/', async (req,res)=>{
    try{ 
        //leemos lo obtenido del body
       const {title,description,code,price,status,stock,category,thumbnails, ...propiedadNoAceptada}= req.body;
       //en caso de que el usuario nos de mas propiedades de las aceptadas, arrojamos un error 
       if(Object.keys(propiedadNoAceptada).length > 0){
            return res.status(400).json({ error: 'Propiedades adicionales no permitidas.' });
        }
        else{
            const producto = {title,description,code,price,status,stock,category,thumbnails}; //asignamos a producto el objeto enviado
            producto.status = (producto.status == null) ? true : producto.status; // en caso de que status no se envie, o se envie como nulo, se le dara como valor true
            producto.thumbnails = (producto.thumbnails == null) ? [] : producto.thumbnails; // en caso de que thumbnails no se envie, o se envie como nulo, se le dara como valor []
            
            const ok =  await validacionTipoDatoP(producto); // validamos el producto
            if (Object.keys(ok).length > 0) { // en caso de que tenga propiedades, mostramos el error
                res.setHeader('Content-Type','application/json');
                return res.status(400).json({ok})
            } 
            else {
                //en caso de que no tenga propiedades quiere decir que paso la validacion
                    let existe;
                    try{
                        existe = await productosModelo.findOne({deleted:false,code})
                    }catch(error){
                        
                    }

                    if(existe){
                        res.setHeader('Content-Type','application/json');
                        return res.status(400).json({error:`El producto con code: ${code}, ya existe.`})
                    }
                    
                    else{
                             try {
                                let nuevoProducto=await productosModelo.create(producto)
                                res.setHeader('Content-Type','application/json');
                                return res.status(200).json({payload:nuevoProducto});
                            } catch (error) {
                                    res.setHeader('Content-Type','application/json');
                                    return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message})
                                    }
    

                     }
        }
        }
    }
        catch (error) {
            // si la promesa falla
           res.status(500).json({ error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message });
        }
})

prodRouter.put('/:pid',async (req,res)=>{

    try{ 
        //leemos el id ingresado y lo parseamos a entero
        let id=req.params.pid;
        if(!mongoose.Types.ObjectId.isValid(id)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ingrese un id válido...!!!`})
        }

        //si esta todo bien, leemos lo obtenido del body
       const {title,description,code,price,status,stock,category,thumbnails, ...propiedadNoAceptada}= req.body;
       
       //en caso de que el usuario nos de mas propiedades de las aceptadas, arrojamos un error 
       if(Object.keys(propiedadNoAceptada).length > 0){
            return res.status(400).json({ error: 'Propiedades adicionales no permitidas.' });
        }
        else{
            const producto = {title,description,code,price,status,stock,category,thumbnails}; //asignamos a producto el objeto leido del body
                   try{
                    //Procedemos a buscar el id del producto
                    let prod = await productosModelo.findOne({deleted:false, _id:id})
                    if(!prod){
                        res.setHeader('Content-Type','application/json');
                        return res.status(400).json({error:`El producto con id: ${id}, no existe.`})
                    }
                    // si lo encuentro, entonces mediante spread, asigno sus propiedades
                    let prodMod = {...prod._doc, ...producto}                
                    
                    const ok =  await validacionTipoDatoP(prodMod); // validamos el producto
                if (Object.keys(ok).length > 0) { // en caso de que tenga propiedades, mostramos el error
                    res.setHeader('Content-Type','application/json');
                    return res.status(400).json({ok})
                }
                else{
                    //Si el objeto el valido procedo a actualizar el producto con los nuevos valores
                    try{
                        const resultado=await productosModelo.updateOne({deleted:false, _id:id},prodMod)
                        
                        if(resultado.modifiedCount>0){
                            res.setHeader('Content-Type','application/json');
                            return res.status(200).json({payload:"Modificacion realizada"});
                        }else{
                            res.setHeader('Content-Type','application/json');
                            return res.status(400).json({error:`No se concretó la modificación`})
                        }
    
                    }catch(error){
                        return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message})
                    }
                }
                }
            catch (error) {
                // si la promesa falla
                return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message})
        }
    } 
}

    catch (error) {
            // si la promesa falla
            return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message})
    }
        
})

prodRouter.delete('/:pid',async (req,res)=>{
    
        //leemos el id ingresado y lo parseamos a entero
        let id=req.params.pid;
        if(!mongoose.Types.ObjectId.isValid(id)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ingrese un id válido...!!!`})
        }
        try{
            let prod = await productosModelo.findOne({deleted:false, _id:id})
            if(!prod){
                res.setHeader('Content-Type','application/json');
                return res.status(400).json({error:`El producto con id: ${id}, no existe.`})
            }
            let resultado
                    try {
                        resultado=await productosModelo.updateOne({deleted:false, _id:id},{$set:{deleted:true}})

                        if(resultado.modifiedCount>0){
                            res.setHeader('Content-Type','application/json');
                            return res.status(200).json({payload:"Eliminacion realizada"});
                        }else{
                            res.setHeader('Content-Type','application/json');
                            return res.status(400).json({error:`No se concretó la eliminacion`})
                        }
                    } catch (error) {
                        res.setHeader('Content-Type','application/json');
                        return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message})

                    }
        }
        
        catch(error){
            return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message})
        }          
    })
    
    


