import carrRou from 'express';
import mongoose from 'mongoose';
import {carritosModelo} from '../dao/models/carrito.models.js';
import {productosModelo} from '../dao/models/productos.models.js';

export const carrRouter = carrRou();

carrRouter.use(carrRou.json())
carrRouter.use(carrRou.urlencoded({extended:true}))

async function validar(productosDB, productosUser){
    let i = 0;
    productosDB.forEach((productoDB) => {
        productosUser.forEach((productoUs) => {
                    if(productoDB._id == productoUs.idProducto){
                        i = i+1;
                    }
        });
    });
    return i;
}

carrRouter.get('/',async (req,res)=>{
   
    try{ 
       
            //en caso de que sea numero procedemos a buscar el id
            let carritos = await carritosModelo.findOne({deleted:false}).populate('productos.idProducto');
            res.setHeader('Content-Type','application/json');
            res.status(200).json(carritos);
        
    }
    catch (error) {
            // si la promesa falla
            return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message})
    }

    
})

carrRouter.get('/:cid',async (req,res)=>{
   
        try{ 
            //leemos el id ingresado y lo parseamos a entero
            let id=req.params.cid;
            if(!mongoose.Types.ObjectId.isValid(id)){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Ingrese un id válido...!!!`})
            }
                //en caso de que sea numero procedemos a buscar el id
                let carrito = await carritosModelo.findOne({deleted:false, _id:id}).populate('productos.idProducto');
                if(carrito){
                    res.setHeader('Content-Type','application/json');
                     res.status(200).json(carrito);
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

carrRouter.post('/', async (req,res)=>{
    try {
        let nuevoCarrito=await carritosModelo.create({})
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:nuevoCarrito});
    } catch (error) {
            res.setHeader('Content-Type','application/json');
            return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message})
            }    
   
})

carrRouter.post('/:cid/products/:pid', async (req,res)=>{
        
            //leemos el id ingresado y lo parseamos a entero
            let cid = req.params.cid
            let pid = req.params.pid
            if(!mongoose.Types.ObjectId.isValid(cid)){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Ingrese un id de carrito válido...!!!`})
            }
            if(!mongoose.Types.ObjectId.isValid(pid)){
                res.setHeader('Content-Type','application/json');
                return res.status(400).json({error:`Ingrese un id de producto válido...!!!`})
            }
            const pidx = new mongoose.Types.ObjectId(pid);
            console.log(pidx);
            try{
                
            //en caso de que sea numero procedemos a buscar el id
                let carrito = await carritosModelo.findOne({deleted:false, _id:cid});
                let producto = await productosModelo.findOne({deleted:false, _id:pid});
                
                if(!carrito){
                    res.setHeader('Content-Type','application/json');
                    return res.status(400).json({error:`No existe el id de carrito ingresado...!!!`})
                }
                else if(!producto){
                    res.setHeader('Content-Type','application/json');
                    return res.status(400).json({error:`No existe el id de producto ingresado...!!!`})
                }
                else{
                    
                    if(carrito.productos.length < 1){
                        
                        carrito.productos.push({idProducto: pid, quantity: 1})
                        const resultado = await carritosModelo.updateOne(
                            { deleted: false, _id: cid },
                            { $set: { productos: carrito.productos } }
                          );
                        if(resultado.modifiedCount>0){
                            res.setHeader('Content-Type','application/json');
                            return res.status(200).json({payload:"Modificacion realizada"});
                        }else{
                            res.setHeader('Content-Type','application/json');
                            return res.status(400).json({error:`No se concretó la modificación`})
                        }
                    }
                    else{
                        
                        let existe = carrito.productos.findIndex(producto => producto.idProducto.equals(pidx))
                        
                        //Corroboramos si ya existe el producto en el carrito
                        if(existe!==-1){
                        
                        carrito.productos[existe].quantity = carrito.productos[existe].quantity +1;
                        
                        const resultado = await carritosModelo.updateOne(
                            { deleted: false, _id: cid },
                            { $set: { productos: carrito.productos } }
                          );
                        if(resultado.modifiedCount>0){
                            res.setHeader('Content-Type','application/json');
                            return res.status(200).json({payload:"Modificacion realizada"});
                        }else{
                            res.setHeader('Content-Type','application/json');
                            return res.status(400).json({error:`No se concretó la modificación`})
                        }
                        }
                        else{
                            carrito.productos.push({idProducto: pid, quantity: 1})
                        const resultado = await carritosModelo.updateOne(
                            { deleted: false, _id: cid },
                            { $set: { productos: carrito.productos } }
                          );
                        if(resultado.modifiedCount>0){
                            res.setHeader('Content-Type','application/json');
                            return res.status(200).json({payload:"Modificacion realizada"});
                        }else{
                            res.setHeader('Content-Type','application/json');
                            return res.status(400).json({error:`No se concretó la modificación`})
                        }
                        }
                    }
                }
                    
                

            }catch(error){
                return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message})
            }

                
        
})

carrRouter.put('/:cid/products/:pid', async (req,res)=>{
        
    //leemos el id ingresado y lo parseamos a entero
    let cid = req.params.cid
    let pid = req.params.pid
    const {quantity, ...propiedadNoAceptada}= req.body;
    if(!mongoose.Types.ObjectId.isValid(cid)){
    res.setHeader('Content-Type','application/json');
    return res.status(400).json({error:`Ingrese un id de carrito válido...!!!`})
    }
    if(!mongoose.Types.ObjectId.isValid(pid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ingrese un id de producto válido...!!!`})
    }
    if(Object.keys(propiedadNoAceptada).length > 0){
        return res.status(400).json({ error: 'Propiedades adicionales no permitidas.' });
    }
    const pidx = new mongoose.Types.ObjectId(pid);
    
    try{
        
    //en caso de que sea numero procedemos a buscar el id
        let carrito = await carritosModelo.findOne({deleted:false, _id:cid});
        let producto = await productosModelo.findOne({deleted:false, _id:pid});
        
        if(!carrito){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No existe el id de carrito ingresado...!!!`})
        }
        else if(!producto){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No existe el id de producto ingresado...!!!`})
        }
        else{
            let i = 0;
            carrito.productos.forEach (productoi => {
                    if(productoi.idProducto == pid){
                        productoi.quantity = req.body.quantity;
                        i++;
                    }                
            });
            
          if(i===0){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No existe el producto en el carrito ingresado...!!!`})
          }
    // const resultado = await carritosModelo.updateOne(
    //     { deleted: false, _id: cid },
    //     { $set: { productos: carrito.productos } }
    //   );
    //   if(resultado.modifiedCount>0){
    //     res.setHeader('Content-Type','application/json');
    //     return res.status(200).json({payload:"Modificacion realizada"});
    // }else{
    //     res.setHeader('Content-Type','application/json');
    //     return res.status(400).json({error:`No se concretó la modificación`})
    // }
    }
        }
    catch(error){
        return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message})
    }
})

carrRouter.put('/:cid',async (req,res)=>{
   
    try{ 
        //leemos el id ingresado y lo parseamos a entero
        let id=req.params.cid;
        //leemos lo obtenido del body
        const productosb= req.body;
        let carrito = await carritosModelo.findOne({deleted:false, _id:id});
                if(!carrito){
                    res.setHeader('Content-Type','application/json');
                    return res.status(400).json({error:`No existe el id de carrito ingresado...!!!`})
                }
        let productosT = await productosModelo.find({deleted:false})
        
        const ok = await validar(productosT,productosb);
       
        if (ok !== productosb.length){
            res.setHeader('Content-Type','application/json');
                    return res.status(400).json({error:`No se pueden ingresar productos inexistentes!!!`})
        }
        else{


                productosb.forEach (productob => {
                    if(Object.keys(productob).length > 2){
                        return res.status(400).json({ error: 'Propiedades adicionales no permitidas.' });
                            }
                            else{
                                let existe = carrito.productos.findIndex(producto => producto.idProducto.equals(productob.idProducto))
                                if(existe !== -1){
                                    carrito.productos[existe].quantity = productob.quantity
                                    
                                }else{
                                    
                                        carrito.productos.push(productob);
                                    
                                }
                                
                            }
                                    
                });
              
        const resultado = await carritosModelo.updateOne(
            { deleted: false, _id: id },
            { $set: { productos: carrito.productos } }
          );
          if(resultado.modifiedCount>0){
            res.setHeader('Content-Type','application/json');
            return res.status(200).json({payload:"Modificacion realizada"});
        }else{
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No se concretó la modificación`})
        }
           //en caso de que el usuario nos de mas propiedades de las aceptadas, arrojamos un error 
        }
        }
            catch (error) {
                // si la promesa falla
               res.status(500).json({ error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message });
            }
    })

carrRouter.delete('/:cid/products/:pid', async (req,res)=>{
        
    //leemos el id ingresado y lo parseamos a entero
    let cid = req.params.cid
    let pid = req.params.pid
    if(!mongoose.Types.ObjectId.isValid(cid)){
    res.setHeader('Content-Type','application/json');
    return res.status(400).json({error:`Ingrese un id de carrito válido...!!!`})
    }
    if(!mongoose.Types.ObjectId.isValid(pid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ingrese un id de producto válido...!!!`})
    }
    const pidx = new mongoose.Types.ObjectId(pid);
    console.log(pidx);
    try{
        
    //en caso de que sea numero procedemos a buscar el id
        let carrito = await carritosModelo.findOne({deleted:false, _id:cid});
        let producto = await productosModelo.findOne({deleted:false, _id:pid});
        
        if(!carrito){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No existe el id de carrito ingresado...!!!`})
        }
        else if(!producto){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No existe el id de producto ingresado...!!!`})
        }
        else{
            
            if(carrito.productos.length < 1){
                
                
                    res.setHeader('Content-Type','application/json');
                    return res.status(400).json({error:`No se concretó la modificación, el carrito esta vacio`})
            
            }
            else{
                
                let existe = carrito.productos.findIndex(producto => producto.idProducto.equals(pidx))
                
                //Corroboramos si ya existe el producto en el carrito
                if(existe!==-1){
                //si el encuentra el producto en el carrito y el mismo tiene al menos un producto, directamente eliminamos el objeto
                if(carrito.productos[existe].quantity == 1){
                    carrito.productos.splice(existe,1);
                }
                else{
                    //si tiene mas de un producto, decrementamos la cantidad
                    carrito.productos[existe].quantity = carrito.productos[existe].quantity-1;
                }
                
                const resultado = await carritosModelo.updateOne(
                    { deleted: false, _id: cid },
                    { $set: { productos: carrito.productos } }
                  );
                if(resultado.modifiedCount>0){
                    res.setHeader('Content-Type','application/json');
                    return res.status(200).json({payload:"Modificacion realizada"});
                }else{
                    res.setHeader('Content-Type','application/json');
                    return res.status(400).json({error:`No se concretó la modificación`})
                }
                }
             
            }
        }
            
        

    }catch(error){
        return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message})
    }

        

})

carrRouter.delete('/:cid',async (req,res)=>{
   
    try{ 
        //leemos el id ingresado y lo parseamos a entero
        let id=req.params.cid;
        if(!mongoose.Types.ObjectId.isValid(id)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ingrese un id válido...!!!`})
        }
            //en caso de que sea numero procedemos a buscar el id
            let carrito = await carritosModelo.findOne({deleted:false, _id:id});
            if(carrito){
                const resultado = await carritosModelo.updateOne(
                    { deleted: false, _id: id },
                    { $set: { productos: [] } }
                  );
                if(resultado.modifiedCount>0){
                    res.setHeader('Content-Type','application/json');
                    return res.status(200).json({payload:"Modificacion realizada"});
                }else{
                    res.setHeader('Content-Type','application/json');
                    return res.status(400).json({error:`No se concretó la modificación`})
                }
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