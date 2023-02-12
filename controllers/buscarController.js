const { response, request } = require("express");
const {ObjectId} = require('mongoose').Types;

const {Usuario,Categoria,Producto} = require('../models')


const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async(termino = '', res = response)=>{

    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID)
    {
        
        const usuario = await Usuario.findById(termino);

        return res.json({
            results: (usuario) ? [usuario]:[]
        });
    }

}

const buscar = ( req = request , res = response)=>{
    
    const {coleccion,termino} = req.params;
    
    if( !coleccionesPermitidas.includes(coleccion))
    {
        return res.status(400).json({
            msg:`Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch(coleccion){
        case 'usuarios':
            buscarUsuarios(termino,res);
            break;
        case 'categorias':
            break;
        case 'productos':
            break;
        case 'roles':
            break;

        default:
            res.status(500).json({
                msg:'Se le olvido hacer esta busqueda'
            });
    }
}


module.exports = {
    buscar,
    buscarUsuarios
}