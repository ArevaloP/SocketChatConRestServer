const path = require('path');
const fs = require('fs');

const { request, response } = require("express");
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req = request, res = response) => {
  

  try {
    //Extensiones y carpeta por default
    //  const pathArchivo = await subirArchivo(req.files, ['txt', 'md'], 'textos');
    const pathArchivo = await subirArchivo(req.files);
    res.json({
      nombreArchivo: pathArchivo,
    });
  } catch (msg) {
    
  }
};

const actualizarImagen = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuarios con el id ${id}`,
        });
      }

      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Se olvidó algun caso" });
      break;
  }

  //Limpiar imagenes previas
  if(modelo.img){
    //Hay que borrar la imagen del servidor
    const pathImage = path.join(__dirname, '../uploads/', coleccion, modelo.img);
    if(fs.existsSync(pathImage)){
      fs.unlinkSync(pathImage);
    }
  }

  try{
    const pathArchivo = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = pathArchivo;

  }catch(msg){
    return res.status(400).json({ msg });
  }

  await modelo.save();
  res.json({
    modelo
  });


}


const actualizarImagenCloudinary = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuarios con el id ${id}`,
        });
      }

      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Se olvidó algun caso" });
      break;
  }

  //Limpiar imagenes previas
  if(modelo.img){
    //TODO
    const nombreArr = modelo.img.split('/');
    const nombre = nombreArr[ nombreArr.length - 1 ];
    const [public_id] = nombre.split('.');

    cloudinary.uploader.destroy(public_id);
  }

  const {tempFilePath} = req.files.archivo;
  const {secure_url} = await cloudinary.uploader.upload(tempFilePath)

  
  modelo.img = secure_url;

  await modelo.save();
  res.json(modelo);


}

const mostrarImagen = async(req=request, res=response)=>{
  
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuarios con el id ${id}`,
        });
      }

      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Se olvidó algun caso" });
      break;
  }

  //Limpiar imagenes previas
  if(modelo.img){
    //Hay que borrar la imagen del servidor
    const pathImage = path.join(__dirname, '../uploads/', coleccion, modelo.img);
    if(fs.existsSync(pathImage)){
      return res.sendFile(pathImage);
    }
  }

  const pathNoImage = path.join(__dirname, '../assets/no-image.jpg');

  res.sendFile(pathNoImage);

}

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary
};
