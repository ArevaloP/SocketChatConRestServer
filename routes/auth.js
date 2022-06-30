const {Router} = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { loginController, googleAuth, renovarToken } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jsw');

const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatorio').not().isEmpty(),
    validarCampos
] ,loginController);

router.post('/google', [
    check('id_token', 'ID Token de google es necesario').not().isEmpty(),
    validarCampos
] ,googleAuth);

router.get('/', validarJWT, renovarToken);


module.exports = router;