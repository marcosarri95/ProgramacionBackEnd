import mongoose from "mongoose";

const usuariosColeccion='message'
const usuariosEsquema=new mongoose.Schema(
    {
        
        email: {
           type: String, unique: false, required: true 
        }, 
        mensaje: String, 
        deleted: {
            type: Boolean, default: false 
        }
    },
    {
        timestamps: true,
        // collection: 'bigUsers',
        strict: false
    }
)

export const usuariosModelo=mongoose.model(usuariosColeccion, usuariosEsquema)