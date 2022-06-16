const { request, response } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");

const loginController = async (req=request, res= response)=>{

    const {correo, password} = req.body;

    try {

        //Vrificar si el email existe
        const usuario = await Usuario.findOne({correo});

        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - email'
            });
        }

        //Si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        //Verificar pass
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if( !validPassword ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        //Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'ok',
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Algo salio mal'
        });
    }

    
}

module.exports = {
    loginController
}