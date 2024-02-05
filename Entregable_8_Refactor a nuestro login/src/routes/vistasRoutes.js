import Router from 'express';
import {productosModelo} from '../dao/models/productos.models.js';
export const router = Router();

const auth=(req, res, next)=>{
    if(!req.session.usuario){
       return res.redirect('/login')
    }
    next()
}

const authP=(req, res, next)=>{
    if(req.session.usuario){
       return res.redirect('/perfil')
    }
    next()
}

router.get('/chat', async(req, res) => {
    res.status(200).render('chat',{
        titulo:"Chat", estilo:"styles"
    })
});


router.get('/',(req,res)=>{

    res.setHeader('Content-Type','text/html')
    res.status(200).render('home')
})

router.get('/registro',authP,(req,res)=>{

    let {error}=req.query

    res.setHeader('Content-Type','text/html')
    res.status(200).render('registro', {error})
})

router.get('/login',authP,(req,res)=>{

    let {error, mensaje}=req.query

    res.setHeader('Content-Type','text/html')
    res.status(200).render('login', {error, mensaje})
})

router.get('/perfil', auth, async (req,res)=>{

    try{ 
        let listaProductos = await productosModelo.find({deleted:false}).lean();
        let usuario=req.session.usuario
        if(req.session.isAdmin===true){
            req.session.admin=true;
        }
        res.setHeader('Content-Type','text/html')
        return res.status(200).render('perfil', {usuario, listaProductos})
        }
    catch (error) {
            // si la promesa falla
        return res.status(500).json({ error: 'Hubo un error al obtener los productos.' });
        }


    
})




