const Role = require('../models/role');
const {Usuario, Categoria, Producto} = require('../models');

const esRolValido = async (rol = '')=>{
    const existeRole = await Role.findOne({rol});
    if(!existeRole){
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
}

const emailExist = async(correo = '')=>{
    const existEmail = await Usuario.findOne({correo});
    if( existEmail){
      throw new Error('El correo ingresado ya existe en la base de datos');
    }
}

const existeUsuarioById = async(id)=>{
    const existUsuaio = await Usuario.findById(id);
    if( !existUsuaio){
      throw new Error('El id enviando no existe');
    }
}

const existeCategoriaById = async(id)=>{

    const existeCategoria = await Categoria.findById(id);
    if( !existeCategoria){
      throw new Error('El id enviando no existe');
    }
}

const existeProductoById = async(id)=>{

  const existeProducto = await Producto.findById(id);
  if( !existeProducto){
    throw new Error('El id enviando no existe');
  }
}


module.exports = {
    esRolValido,
    emailExist,
    existeUsuarioById,
    existeCategoriaById,
    existeProductoById
}