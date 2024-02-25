import mongoose from "mongoose";

const usuariosColeccion='usuarios'
const usuariosEsquema=new mongoose.Schema(
    {
        first_name: String,
        last_name: String,
        email: {
            type: String, unique: true
        },
        password: String,
        age: Number,
        isAdmin:Boolean
    },
    {
        timestamps: {
            updatedAt: "FechaUltMod", createdAt: "FechaAlta"
        }
    },
    {strict:false}
)

export const usuariosModelo=mongoose.model(usuariosColeccion, usuariosEsquema)