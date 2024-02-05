import mongoose from "mongoose";

const messageColeccion='message'
const messageEsquema=new mongoose.Schema(
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

export const messageModelo=mongoose.model(messageColeccion, messageEsquema)