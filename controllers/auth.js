const { response, request } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuarios');
const { generarJWT } = require("../helpers/generar-jwt");
const login = async(req=request,res = response)=>{

    const {correo,password} = req.body;

    try{

        //Verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario)
        {
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - correo'
            });
        }
        //Si el usuario esta activo
        if(!usuario.estado)
        {
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - estado: false'
            });
        }
        //Verificar la contraseña

        const validPassword = bcryptjs.compareSync(password,usuario.password);
        if(!validPassword)
        {
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - password'
            });
        }


        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
        //este return sirve para que no de un error al regresar dos peticiones
        return;

    } catch (error){
        console.log(error);
        
         res.status(500).json({
            msg:'Hable con el administrador'
        });
    }

    res.json({
        msg:'Login ok'
    });
}

module.exports = {
    login
}