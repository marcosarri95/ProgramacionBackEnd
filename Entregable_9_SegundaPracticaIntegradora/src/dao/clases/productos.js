const { log } = require('console');
const fs = require('fs')

class ProductManager {


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

    getProducts= async () => {
    await this.rFile();
    return this.products
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

        addProduct= async(title,description,code,price,status,stock,category,thumbnails="")=>{
            
            await this.rFile();    
            //luego verificamos que no exista un producto con el mismo code
            let existe = this.products.findIndex(indice=>indice.code === code );
            
            if(existe!==-1){
            console.log(`Ya existe un producto ${code} que se esta queriendo ingresar`)
            return false;
            }
            
            else{
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
            this.products.push({id,title,description,code,price,status,stock,category,thumbnails});
            //luego grabamos en el archivo convirtiendo nuestro vector de objetos (JSON) a una cadena de texto
            await this.wFile();
            return true;
            }
            
                }
            
                
            updateProduct= async(id,title,description,price,thumbnail,code,stock)=>{
                        await this.rFile();  
                        //encontramos el indice para cual existe el id
                        let existe = this.products.findIndex(indice=>indice.id === id );
                        if(existe===-1){
                            console.log(`Error: id:${id} not found`)
                            return false;  
                        }
                              
                        else{
                            console.log(this.products[existe])
                            //actualizamos si el usuario ingreso el campo, si no, no hacemos nada
                            !!title===false ? null:this.products[existe].title = title  
                            !!description===false ? null:this.products[existe].description = description
                            !!price===false ? null:this.products[existe].price = price
                            !!thumbnail===false ? null:this.products[existe].thumbnail = thumbnail 
                            !!code===false ? null:this.products[existe].code = code
                            !!stock===false ? null:this.products[existe].stock = stock 
                            await this.wFile();
                            return true;    
                        }  
            }


            deleteProduct= async(id)=>{

               
                let existe = this.products.findIndex(indice=>indice.id === id );
                if(existe===-1){
                    console.log(`Error: id:${id} not found`) 
                    return false;
                    }
                else{
                    this.products.splice(existe,1);
                    await this.wFile();
                    return true;
                } 
                
                }
                
            validacion=async(title,description,code,price,status=true,stock,category,thumbnails=[])=>{
                let retorno;
                if(!title || !description || !code || !price || !stock || !category){
                    //si los campos estan vacios, devolvemos false
                    return false;
                }
                else{
                    
                    //en caso contrario, comparamos el tipo de dato, si es correcto
                    if(typeof title==='string' && typeof description==='string' && typeof code==='string' && typeof price==='number' && typeof status==='boolean' && typeof stock==='number' && typeof category==='string' && Array.isArray(thumbnails)){
                        //en caso de que todos los tipos de datos sean verdaderos, comparamos thumbnails, si tiene mas de un campo
                        //en caso de que no tenga mas de un campo, se cumplio la validacion de los datos y se retorna true
                        if(thumbnails.length > 0){
                            thumbnails.forEach(str => {
                                    if(typeof str !== 'string'){
                                        console.log(str + ": No es un string");
                                        retorno = false;
                                    }
                                });    
                                if(retorno===false){
                                    return false;
                                }
                                else{
                                    return true;
                                }
                            }
                        else{
                            return true;
                        }
                        }
                    

            }
            }
            }
                     
                
            
    module.exports = ProductManager;