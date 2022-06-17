const {Router} = require('express');
const { check } = require('express-validator');
const { obtenerProductos, obtenerProductoById, crearProducto, actualizarProducto, eliminarProducto } = require('../controllers/productos');

const { existeCategoriaById, existeProductoById } = require('../helpers/db-validators');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');


const router = Router();

//Obetener todas las coategorias
router.get('/', obtenerProductos);

//Obtener un categoria por id
router.get('/:id',[
    check('id', 'No es un id de Mongo Valido').isMongoId(),
    validarCampos,
    check('id').custom(existeProductoById),
    validarCampos
] , obtenerProductoById);

//Crear coategoria - privado 
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo valido').isMongoId(),
    check('categoria').custom(existeCategoriaById),
    validarCampos
],  crearProducto);

//Actualizar privado
router.put('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo Valido').isMongoId(), 
    validarCampos,
    check('id').custom(existeProductoById),
    validarCampos,
] , actualizarProducto);


//Borrar una categoria
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo Valido').isMongoId(), 
    validarCampos,
    check('id').custom(existeProductoById),
    validarCampos,
], eliminarProducto);

module.exports = router;

