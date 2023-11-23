const fs = require('fs')

class carritoManager {


    constructor(path) {
        //creamos el vector que contendrá los productos
        this.products = []
        this.path = path;
        console.log(path)

    }

    rFile = async () => {
        
        let contenido = await fs.promises.readFile(this.path, 'utf-8');
        if (contenido == ""){
            }
        else{
            this.products = JSON.parse(contenido)
        }
        
    }

    wFile = async () => {
        await fs.promises.writeFile(this.path,JSON.stringify(this.products))
    }

 
    existeProducto= async (id)=> {
        await this.rFile();
        let existe = this.products.findIndex(indice => indice.id === id);
            
        if (existe!==-1) {
            return true;
        }
        else {
            return false;
        }

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

    addCarro= async()=>{
            
            await this.rFile();    
            let productos = []
                //si el producto no existe, entonces buscamos el indice existente mas grande, y le sumamos uno para hacerlo autoincremental
                //en el caso de que el vector de productos este vacio, le asignamos al primer valor un id de 1.
               const indice = this.products.reduce((antProducto, actProducto) => {
              return antProducto?.id > actProducto.id ? antProducto : actProducto;
            }, null);
            
            let id;
            
            if(indice === null){id = 1}
            else{
                id = indice.id + 1;
            }

            this.products.push({id,productos});
            //luego grabamos en el archivo convirtiendo nuestro vector de objetos (JSON) a una cadena de texto
            await this.wFile();
            return true;
            }

            addProduct= async(idCarro,idProducto)=>{
            
                await this.rFile();
                let quantity = 1;
                let id = this.products.findIndex(indice => indice.id === idCarro);
                
                if(this.products[id].productos.length === 0){
                    this.products[id].productos.push({idProducto, quantity})
                }
                else{
                    let idp = this.products[id].productos.findIndex(indp => indp.idProducto === idProducto);
                    if(idp!==-1){
                        this.products[id].productos[idp].quantity++
                    }
                    else{
                        this.products[id].productos.push({idProducto, quantity})
                    }
                    
                }
                console.log(this.products[id])
                  //luego grabamos en el archivo convirtiendo uestro vector de objetos (JSON) a una cadena de texto
                await this.wFile();
                return true;
                }
            
             
            
                 }
                     
                
            
    module.exports = carritoManager;