import passport from 'passport'
import local from 'passport-local'
import { usuariosModelo } from '../dao/models/usuarios.models.js'
import { creaHash, validaPassword } from '../utils.js'


export const inicializarPassport=()=>{

    passport.use('registro', new local.Strategy(
        {
            passReqToCallback: true, usernameField: 'email' 
        },
        async(req, username, password, done)=>{
            try {
                let {first_name, last_name, age ,email}=req.body
                if(!first_name || !last_name || !email || !password || !age){
                    return done(null, false)
                }
                let regMail=/^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
                if(!regMail.test(email)){ 
                    return done(null, false)
                }
                let existe=await usuariosModelo.findOne({email})
                if(existe){
                    return done(null, false)
                }
                password=creaHash(password)
                let usuario
                let i = email==="adminCoder@coder.com" ? true : false
                try {
                    usuario=await usuariosModelo.create({first_name,last_name,email,password, age, isAdmin:i})
                    return done(null, usuario)
                } catch (error) {
                    return done(null, false)
                }
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use('login', new local.Strategy(
        {
            usernameField: 'email'
        },
        async(username, password, done)=>{
            try {
                if(!username || !password){
                    
                    return done(null, false)
                }
                let usuario=await usuariosModelo.findOne({email:username}).lean()
                if(!usuario){
                    return done(null, false)
                }
                if(!validaPassword(usuario, password)){
                    return done(null, false)
                }     
                delete usuario.password
                return done(null, usuario)

            } catch (error) {
                done(error, null)
            }
        }
    ))


    // configurar serializador y deserializador
    passport.serializeUser((usuario, done)=>{
        return done(null, usuario._id)
    })

    passport.deserializeUser(async(id, done)=>{
        let usuario=await usuariosModelo.findById(id)
        return done(null, usuario)
    })

} // fin inicializarPassport