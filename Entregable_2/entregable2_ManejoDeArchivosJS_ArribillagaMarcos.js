

class ProductManager{


    constructor(path){
        //creamos el vector que contendrá los productos
       this.products = []
       this.path = path;
       this.fs = require('fs')
      
    }

addProduct(title,description,price,thumbnail,code,stock){

    if(this.fs.existsSync(this.path)){
        //this.products = JSON.parse(fs.readFileSync(path, 'utf8'));
        //primero evaluamos que se ingresen todos los campos, lo que hacemos es verificar que no sea
//ni undefined, ni null, ni NaN o una cadena vacia ""
if(!!title===false || !!description===false || !!price===false || !!thumbnail===false || !!code===false || !!stock===false){
    console.log("Todos los campos son obligatorios!")
}
else{
//luego verificamos que no exista un producto con el mismo indice
let existe = this.products.findIndex(indice=>indice.code === code );

if(!existe){
console.log(`Ya existe un producto ${code} que se esta queriendo ingresar`)
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
this.products.push({id,title,description,price,thumbnail,code,stock});
//luego grabamos en el archivo convirtiendo nuestro vector de objetos (JSON) a una cadena de texto
this.fs.writeFileSync(this.path,JSON.stringify(this.products))
}
}
    }
    else{
        console.log(`No se puede encontrar la ruta determinada: ${this.path}`)
    }

}


getProducts(){
if(this.fs.existsSync(this.path)){
    return this.products = JSON.parse(this.fs.readFileSync(this.path, 'utf8'));
}
else{
    console.log(`No se puede encontrar la ruta determinada: ${this.path}`)
}

 }

getProductById(id){

    if(fs.existsSync(this.path)){
        this.products = JSON.parse(this.fs.readFileSync(this.path, 'utf8'));
            //buscamos por id en el vector de objetos y devolvemos el que tiene el id deseado
                //en caso de que no, retornamos error
        let existe = this.products.findIndex(indice=>indice.id === id );
    if(!existe){
        return this.products[existe]
    }
    else{
        console.log(`Error: id:${id} not found`)   
    }  
    }
    else{
        console.log(`No se puede encontrar la ruta determinada: ${this.path}`)
    }
 
}

updateProduct(id,title,description,price,thumbnail,code,stock){
    //verificamos si existe el archivo
    if(this.fs.existsSync(this.path)){
        //extraemos el contenido de texto y lo parseamos a formato JSON
        this.products = JSON.parse(this.fs.readFileSync(this.path, 'utf8'));
        //encontramos el indice para cual existe el id
        let existe = this.products.findIndex(indice=>indice.id === id );
        if(!existe){
            //actualizamos si el usuario ingreso el campo, si no, no hacemos nada
            !!title===false ? null:this.products[existe].title = title  
            !!description===false ? null:this.products[existe].description = description
            !!price===false ? null:this.products[existe].price = price
            !!thumbnail===false ? null:this.products[existe].thumbnail = thumbnail 
            !!code===false ? null:this.products[existe].code = code
            !!stock===false ? null:this.products[existe].stock = stock
            this.fs.writeFileSync(this.path,JSON.stringify(this.products))      
        }
              
    else{
        console.log(`Error: id:${id} not found`)   
        }  
    }
    else{
        console.log(`No se puede encontrar la ruta determinada: ${this.path}`)
    }   
}

deleteProduct(id){

    if(this.fs.existsSync(this.path)){
        this.products = JSON.parse(this.fs.readFileSync(this.path, 'utf8'));
        let existe = this.products.findIndex(indice=>indice.id === id );
    if(existe===-1){
        console.log(`Error: id:${id} not found`) 
        }
    else{
        this.products.splice(existe,1);
        this.fs.writeFileSync(this.path,JSON.stringify(this.products))
    } 
    }
    else{
        console.log(`No se puede encontrar la ruta determinada: ${this.path}`)
    }
     
}

borrarArchivo(){
    if(this.fs.existsSync(this.path)){
        this.fs.unlinkSync(this.path)
    }
    else{
        console.log(`No se puede encontrar la ruta determinada: ${this.path}`)
    }
}

}



const productoM = new ProductManager("./archivo.txt");
//console.log(productoM.getProducts());
productoM.addProduct("producto prueba","este es un producto prueba", 200, "sin imagen", "abc123", 25)
productoM.addProduct("producto prueba","este es un producto prueba", 200, "sin imagen", "abc1234", 25)
productoM.addProduct("producto prueba","este es un producto prueba", 200, "sin imagen", "abc1235", 25)
productoM.addProduct("producto prueba","este es un producto prueba", 200, "sin imagen", "abc126", 25)
productoM.addProduct("producto prueba","este es un producto prueba", 200, "sin imagen", "abc125", 25)
console.log(productoM.getProducts());
productoM.updateProduct(1,"prueba2","cambio algo")
console.log(productoM.getProducts());
productoM.deleteProduct(1)
console.log(productoM.getProducts());
//productoM.borrarArchivo()