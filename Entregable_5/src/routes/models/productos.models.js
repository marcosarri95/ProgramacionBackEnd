const mongoose = require('mongoose');

const productosColeccion='productos'
const productosEsquema=new mongoose.Schema(
    {
        id:{
            type: Number, unique:true, required: true
        },
        title: {
            type: String, unique:false, required: true 
         }, 
        description: {
            type: String, unique:false, required: true 
         }, 
        code: {
            type: String, unique:true, required: true 
         }, 
        price: {
            type: Number, unique:false, required: true 
         },
        status: {
            type: Boolean, unique:false, required: false 
         },
        stock:{
            type: Number, unique:false, required: true 
         },
        category: {
            type: String, unique:false, required: true 
         },
        thumbnails: {
            type: Array, unique:false, required: false 
         },
        deleted: {
            type: Boolean, default: false 
        }
    },
    {
        timestamps: true,
        // collection: 'bigUsers',
        strict: true
    }
)

const productosModelo=mongoose.model(productosColeccion, productosEsquema);
module.exports = productosModelo;
