const carrRou = require('express')
const path = require('path')
const productos = require ('../clases/productos')
const carrito = require ('../clases/carrito')
const productoM = new productos("../archivos/archivo.txt");
const carritoM = new carrito("../archivos/carrito.txt");

const carrRouter = carrRou();

carrRouter.use(carrRou.json())
carrRouter.use(carrRou.urlencoded({extended:true}))

carrRouter.get('/:cid',async (req,res)=>{
    try{ 
        let id = parseInt(req.params.cid)
        if(!isNaN(id)){
        let carrito = await carritoM.getProductById(id);
        if(carrito){
            res.setHeader('Content-Type','application/json');
             res.status(200).json(carrito);
        }
        else{
            res.send(`Error, no existe el carrito con el id: ${req.params.pid}`)
        }
        }else{
            return res.status(500).json({ error: 'Hubo un error, debe ingresar un numero para ver su carrito.' });
        }
        }
        catch (error) {
            // si la promesa falla
            res.status(500).json({ error: 'Hubo un error al obtener el carrito.' });
        }

        
})

carrRouter.post('/', async (req,res)=>{
    try{ 

            carritoM.addCarro([])
            res.setHeader('Content-Type','application/json');
            res.status(200).json('OK');    
        }
        
        
        catch (error) {
            // si la promesa falla
            res.status(500).json({ error: 'Hubo un error al obtener los productos.' });
        }
})

carrRouter.post('/:cid/products/:pid', async (req,res)=>{
    try{ 
        let cid = parseInt(req.params.cid)
        let pid = parseInt(req.params.pid)
        if(!isNaN(cid) && !isNaN(pid)){
            if(await productoM.existeProducto(pid) && await carritoM.existeProducto(cid)){
                carritoM.addProduct(cid,pid)
                res.setHeader('Content-Type','application/json');
                return res.status(200).json('OK');
            }
            else{
                return res.status(500).json({ error: 'No existe el producto o carrito.' });
            }
        }
        else{
            
            return res.status(500).json({ error: 'Hubo un error, debe ingresar un numero para añardir un producto a su carrito.' });
        }

                
        }
        
        catch (error) {
            // si la promesa falla
            res.status(500).json({ error: 'Hubo un error al obtener los productos.' });
        }
})


module.exports = carrRouter