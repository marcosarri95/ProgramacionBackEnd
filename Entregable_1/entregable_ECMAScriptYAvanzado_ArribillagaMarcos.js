
class ProductManager{


    constructor(path){
        //creamos el vector que contendrá los productos
       this.products = []
       this.path = path;
      
    }

addProduct(title,description,price,thumbnail,code,stock){

//primero evaluamos que se ingresen todos los campos, lo que hacemos es verificar que no sea
//ni undefined, ni null, ni NaN o una cadena vacia ""
if(!!title===false || !!description===false || !!price===false || !!thumbnail===false || !!code===false || !!stock===false){
    console.log("Todos los campos son obligatorios!")
}
else{
//luego verificamos que no exista un producto con el mismo indice
let existe = this.products.find(p=>p.code === code);
if(existe){
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
}
}
}


getProducts(){
return this.products;
}

getProductById(id){
    //buscamos por id en el vector de objetos y devolvemos el que tiene el id deseado
    //en caso de que no, retornamos error
let prdSearch = this.products.find(p=>p.id === id);
if(prdSearch!==undefined){
    return prdSearch
}
else{
    console.log(`Error: id:${id} not found`)
}
}

}

const productoM = new ProductManager();
//console.log(productoM.getProducts());
productoM.addProduct("producto prueba","este es un producto prueba", 200, "sin imagen", "abc123", 25)
//console.log(productoM.getProducts());
productoM.addProduct("producto prueba","este es un producto prueba", 200, "sin imagen", "abc1243", 25)
console.log(productoM.getProductById(2))
let consta2 = productoM.getProducts()
console.log(consta2[1]);
