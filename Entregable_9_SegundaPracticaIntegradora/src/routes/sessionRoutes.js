import { Router } from 'express';
import { usuariosModelo } from '../dao/models/usuarios.models.js';
import {creaHash, validaPassword} from '../utils.js'
import passport from 'passport';
export const router=Router()


router.get('/errorLogin', (req,res)=>{
    return res.redirect('/login?error=Error en el proceso de login...')
})

router.post('/login', passport.authenticate('login',{failureRedirect:'/api/sessions/errorLogin'}), async(req, res)=>{

    // let {email, password}=req.body

    // if(!email || !password){
    //     return res.redirect('/login?error=Complete todos los datos')
    // }

    // let usuario=await usuariosModelo.findOne({email})
    // if(!usuario){
    //     return res.redirect(`/login?error=credenciales incorrectas`)
        
    // }
    // if(!validaPassword(usuario,password)){
    //     return res.redirect(`/login?error=credenciales incorrectas`)
    // }
    
    req.session.usuario={
        nombre:req.user.first_name, apellido: req.user.last_name, email:req.user.email, role:req.user.isAdmin
    }

    res.redirect('/perfil')

})

router.get('/errorRegistro', (req,res)=>{
    return res.redirect('/login?error=Error en el proceso de registro')
})

router.post('/registro', passport.authenticate('registro',{failureRedirect:'/api/sessions/errorRegistro'}),async(req,res)=>{
    
    let {email}=req.body
    // let {first_name, last_name, age, email, password}=req.body
    // if(!first_name || !last_name || !age || !email || !password){
    //     return res.redirect('/registro?error=Complete todos los datos')
    // }

    // let regMail=/^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
    
    // if(!regMail.test(email)){
    //     return res.redirect('/registro?error=Mail con formato incorrecto...!!!')
    // }

    // let existe=await usuariosModelo.findOne({email})
    // if(existe){
    //     return res.redirect(`/registro?error=Existen usuarios con email ${email} en la BD`)
    // }
    
    // password=creaHash(password);
    // let usuario
    // try {
    //     if(email === 'adminCoder@coder.com'){
    //     usuario=await usuariosModelo.create({first_name, last_name, age, email, password, isAdmin:true})
    //     res.redirect(`/login?mensaje=Usuario ${email} registrado correctamente`)
    //     }else{
    //     usuario=await usuariosModelo.create({first_name, last_name, age, email, password,isAdmin:false})
    //     res.redirect(`/login?mensaje=Usuario ${email} registrado correctamente`)
    //     }
    // } catch (error) {
    //     res.redirect('/registro?error=Error inesperado. Reintente en unos minutos')
    // }

    res.redirect(`/login?mensaje=Usuario ${email} registrado correctamente`)

})

router.get('/logout',(req,res)=>{
    
    req.session.destroy(error=>{
        if(error){
            res.redirect('/login?error=fallo en el logout')
        }
    })
    res.redirect('/login')

});


router.get('/github', passport.authenticate('github',{}), (req,res)=>{})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:"/api/sessions/errorGithub"}), (req,res)=>{
    
    console.log(req.user)
    req.session.usuario=req.user
    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        message:"Acceso OK...!!!", usuario: req.user
    });
});

router.get('/errorGithub',(req,res)=>{
    
    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        error: "Error al autenticar con Github"
    });
});