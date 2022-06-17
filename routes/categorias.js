const {Router} = require('express');
const { check } = require('express-validator');

const { crearCategoria, obtenerCategorias, obtenerCategoriaById, actualizarCategoria, eliminarCategoria } = require('../controllers/categorias');
const { existeCategoriaById } = require('../helpers/db-validators');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');


const router = Router();

//Obetener todas las coategorias
router.get('/', obtenerCategorias);

//Obtener un categoria por id
router.get('/:id',[
    check('id', 'No es un id de Mongo Valido').isMongoId(),
    check('id').custom(existeCategoriaById),
    validarCampos
] ,obtenerCategoriaById);

//Crear coategoria - privado 
router.post('/', [
    validarJWT,
    check('nombre', 'EL nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria );

//Actualizar privado
router.put('/:id',[
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id de Mongo Valido').isMongoId(), 
    validarCampos,
    check('id').custom(existeCategoriaById),
    validarCampos,
] ,actualizarCategoria);


//Borrar una categoria
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo Valido').isMongoId(), 
    validarCampos,
    check('id').custom(existeCategoriaById),
    validarCampos,
],eliminarCategoria);

module.exports = router;