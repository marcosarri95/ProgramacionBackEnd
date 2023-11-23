const socket = io();

socket.on("get",socket=>{
    console.log(`Lista de productos:`);
    socket.productos.forEach(producto => {
                console.log(`Producto ${producto.id}`)
                console.log(`Id: ${producto.id}`);
                console.log(`Titulo: ${producto.title}`);
                console.log(`Descripcion: ${producto.description}`);
                console.log(`Codigo: ${producto.code}`);
                console.log(`Precio: ${producto.price}`);
                console.log(`Status: ${producto.status}`);
                console.log(`Stock: ${producto.stock}`);
                console.log(`Categoria: ${producto.category}`);
                console.log(`Rutas: ${ producto.thumbnails}`);
                console.log();
            });
    
})

socket.on("post",socket=>{
    console.log(`Lista de productos:`);
    socket.productos.forEach(producto => {
                console.log(`Producto ${producto.id}`)
                console.log(`Id: ${producto.id}`);
                console.log(`Titulo: ${producto.title}`);
                console.log(`Descripcion: ${producto.description}`);
                console.log(`Codigo: ${producto.code}`);
                console.log(`Precio: ${producto.price}`);
                console.log(`Status: ${producto.status}`);
                console.log(`Stock: ${producto.stock}`);
                console.log(`Categoria: ${producto.category}`);
                console.log(`Rutas: ${ producto.thumbnails}`);
                console.log();
            });
    
})
