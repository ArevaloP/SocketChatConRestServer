const {response, request} = require('express');


const getUsuarios = (req = request, res = response) => {

    const   {q, nombre = 'No name', api_key, page = 1, limit } = req.query;

    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        api_key,
        page,
        limit
    });
  }

const postUsuarios = (req, res = response) => {

    const {nombre, edad} = req.body;

    res.json({
        msg: 'post API - controlador',
        nombre,
        edad
    });
  }

const putUsuarios = (req, res = response) => {

    const {id} = req.params;

    res.json({
        msg: 'put API - controlador',
        id
    });
  }

const deleteUsuarios = (req, res = response) => {
    res.json({
        msg: 'delete API - controlador'
    });
  }

  module.exports = {
    getUsuarios,
    postUsuarios,
    putUsuarios,
    deleteUsuarios
  }
