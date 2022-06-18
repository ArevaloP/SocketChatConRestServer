const {Router} = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccinesPermitidas } = require('../helpers');
const { validarArchivo } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/:coleccion/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('coleccion').custom( c => coleccinesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)

router.post('/', validarArchivo ,cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'No es un id valido').isMongoId(),
    check('coleccion').custom( c => coleccinesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary);


module.exports = router;