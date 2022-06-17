const { request, response, json } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const loginController = async (req = request, res = response) => {
  const { correo, password } = req.body;

  try {
    //Vrificar si el email existe
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - email",
      });
    }

    //Si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - estado: false",
      });
    }

    //Verificar pass
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - password",
      });
    }

    //Generar JWT
    const token = await generarJWT(usuario.id);

    res.json({
      msg: "ok",
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Algo salio mal",
    });
  }
};

const googleAuth = async (req = request, res = response) => {
  const { id_token } = req.body;

  try {

    const {nombre, correo, img} = await googleVerify(id_token);

    let usuario = await Usuario.findOne({correo});

    if(!usuario){
      //Se crea
      const data = {
        nombre,
        correo,
        password: ':P',
        img,
        google: true
      }

      usuario = new Usuario(data);
      await usuario.save();
    }

    //Si el usuario en DB
    if(!usuario.estado){
      return res.status(401).json({
        msg: 'Hable con el administrador - usuario bloqueado'
      });
    }

    //Generar JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token
    });
    
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: 'El token no se pudo verificar'
    });
  }
};

module.exports = {
  loginController,
  googleAuth,
};
