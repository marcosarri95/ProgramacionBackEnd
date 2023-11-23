
const express = require ('express');

////aqui comienza el programa del servidor con express
const routerProduct=require('./routes/products.routes')
const routerCarrito=require('./routes/carrito.routes')

const PORT = 9000;

const app = express();

app.use('/api/products', routerProduct)
app.use('/api/carts', routerCarrito)

app.listen(PORT,()=>{
console.log("Server inicializado")
});

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.send("Bienvenidos a mi server con express")
})

