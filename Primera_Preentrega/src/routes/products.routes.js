const prodRou = require('express')
const path = require('path')
const productos = require ('../clases/productos')
const productoM = new productos("../archivos/archivo.txt");

const prodRouter = prodRou();

prodRouter.use(prodRou.json())
prodRouter.use(prodRou.urlencoded({extended:true}))

prodRouter.get('/:pid',async (req,res)=>{
    try{ 
        //leemos el id ingresado y lo parseamos a entero
        let id = parseInt(req.params.pid)
        if(!isNaN(id)){
            //en caso de que sea numero procedemos a buscar el di
            let product = await productoM.getProductById(id);
            if(product){
                res.setHeader('Content-Type','application/json');
                 res.status(200).json(product);
            }
            else{
                res.send(`Error, no existe el producto con el id: ${req.params.pid}`)
            }
        }
        else{
            //si no se pudo convertir el numero, devolvemos error
            return res.status(500).json({ error: 'Hubo un error, debe ingresar un numero.' });
        }
        
        }
        catch (error) {
            // si la promesa falla
            res.status(500).json({ error: 'Hubo un error al obtener el producto.' });
        }

        
})

prodRouter.get('/',async(req,res)=>{
    try{ 
        let product = await productoM.getProducts();
        let nQuery
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
      
       const {title,description,code,price,status,stock,category,thumbnails, ...propiedadNoAceptada}= req.body;
        if(Object.keys(propiedadNoAceptada).length > 0){
            return res.status(400).json({ error: 'Propiedades adicionales no permitidas.' });
        }
        else{
            let ok = await productoM.validacion(title,description,code,price,status,stock,category,thumbnails)
            if(ok){
                if(await productoM.addProduct(title,description,code,price,status,stock,category,thumbnails)){
                    res.setHeader('Content-Type','application/json');
                    res.status(200).json('OK');
                }
                else{
                    res.status(400).json({ error: 'Ya existe el code para el producto que quiere ingresar' });
                }
            }
            else{
                res.status(400).json({ error: 'Verifique de no enviar propiedades adicionales o campos vacíos' });
            }
            
        }
      }

        catch (error) {
            // si la promesa falla
           res.status(500).json({ error: 'Hubo un error al obtener los productos.' });
        }
})

prodRouter.put('/:pid',async (req,res)=>{
    try{ 
        let id = parseInt(req.params.pid)
        //leemos el id y validamos si es un numero
        if(isNaN(id)){
            res.setHeader('Content-Type','application/json');
            return res.status(500).json({ error: 'El id debe ser numérico' });
        }
        else{
            //en caso de que sea un numero, repetimos el proceso de validacion
            const {title,description,code,price,status,stock,category,thumbnails, ...propiedadNoAceptada}= req.body;
            if(Object.keys(propiedadNoAceptada).length > 0){
                return res.status(400).json({ error: 'Propiedades adicionales no permitidas.' });
            }
            else{
                
                let ok = await productoM.validacion(title,description,code,price,status,stock,category,thumbnails)
                console.log(ok)
            if(ok){
                let products = await productoM.getProducts()
                 let existe = products.findIndex(indice => indice.id === id);
            
            if (existe!==-1) {
                let prodMod = {
                    ...products[existe],
                    ...req.body,
                    id
                }
                    products[existe] = prodMod;
                    await productoM.wFile();
                    res.setHeader('Content-Type','application/json');
                    return res.status(200).json({ code:'OK' });
                }
                else {
                    res.setHeader('Content-Type','application/json');
                    return res.status(500).json({ error: 'El id ingresado no existe' });
                }
              
            }
            else{
                res.setHeader('Content-Type','application/json');
                    return res.status(500).json({ error: 'Deben incluirse los campos correctamente' });
            }

        }
        }

        }
        catch (error) {
            // si la promesa falla
            res.status(500).json({ error: 'Hubo un error al obtener el producto.' });
        }
        
})

prodRouter.delete('/:pid',async (req,res)=>{
    try{ 
        let id = parseInt(req.params.pid)
           if(!isNaN(id)){
            if(productoM.deleteProduct(id)){
                res.setHeader('Content-Type','application/json');
                res.status(200).json('OK');
            }
            else{
                res.status(500).json({ error: 'No existe el id' });
            }
           }
           else{
            return res.status(500).json({ error: 'El id debe ser numérico' });
           }
    
        }
        catch (error) {
            // si la promesa falla
            res.status(500).json({ error: 'Hubo un error al obtener el producto.' });
        }
        
})


module.exports = prodRouter