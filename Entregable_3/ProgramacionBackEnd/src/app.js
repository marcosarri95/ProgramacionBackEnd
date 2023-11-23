const fs = require('fs')
const express = require ('express');

class ProductManager {


    constructor(path) {
        //creamos el vector que contendrá los productos
        this.products = []
        this.path = path;


    }

    verExistencia = async () => {

        const existe = await fs.access(this.path, fs.constants.F_OK, (err) => {
            if (err) {
                return false
            } else {
                return true
            }
        });

    }

    rFile = async () => {
        
        let contenido = await fs.promises.readFile(this.path, 'utf-8');
        if (contenido == ""){
            }
        else{
            this.products = JSON.parse(contenido)
        }
        
    }

    getProducts= async () => {
    await this.rFile();
    return this.products
    }


                   
    getProductById= async (id) => {
        await this.rFile();
        //buscamos por id en el vector de objetos y devolvemos el que tiene el id deseado
            //en caso de que no, retornamos error
            let existe = this.products.findIndex(indice => indice.id === id);
            
            if (existe!==-1) {
                return this.products[existe];
            }
            else {
                return false;
            }
            }
                
    }
    
    
const productoM = new ProductManager("./archivo.txt");

////aqui comienza el programa del servidor con express

const PORT = 9000;

const app = express();

app.listen(PORT,()=>{
console.log("Server inicializado")
});

app.get('/',(req,res)=>{
    res.send("Bienvenidos a mi server con express")
})

app.get('/products/:pid',async (req,res)=>{
    try{ 
        let id = parseInt(req.params.pid)
        let product = await productoM.getProductById(id);
        if(product){
            res.setHeader('Content-Type','application/json');
             res.status(200).json(product);
        }
        else{
            res.send(`Error, no existe el producto con el id: ${req.params.pid}`)
        }
        }
        catch (error) {
            // si la promesa falla
            res.status(500).json({ error: 'Hubo un error al obtener el producto.' });
        }

        
})

app.get('/products',async(req,res)=>{
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


