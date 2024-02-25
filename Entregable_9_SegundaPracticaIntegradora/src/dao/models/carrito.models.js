import mongoose from "mongoose";

const carritosColeccion='carts'

const productoEsquema = new mongoose.Schema({
    _id: false, // Desactiva la generación automática del campo _id
    idProducto: {
        type: mongoose.Schema.Types.ObjectId,
        required: false, // Hace que el campo no sea obligatorio
    },
    quantity: {
        type: Number,
        required: true
    }
});


const carritosEsquema=new mongoose.Schema(
    {
        
        productos: {
            type: [productoEsquema], unique:false, required: true,
            default: [], // Establecemos un valor por defecto como un array vacío
         }, 
        deleted: {
            type: Boolean, default: false 
        }
    },
    {
        timestamps: true,
        strict: true
    }
)

export const carritosModelo=mongoose.model(carritosColeccion, carritosEsquema);