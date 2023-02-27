const { Router } = require('express');

const { check}  = require('express-validator');
const { login, googleSignIn, renovarToken } = require('../controllers/auth');
const { validarJWT } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');


const router = new Router();

router.post('/login',[
    //Ten cuidado con los espacios en los strings
    check('correo','El correo es obligatorio').isEmail(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login);
router.post('/google',[
    //Ten cuidado con los espacios en los strings
    check('id_token','id_token es necesario').not().isEmpty(),
    validarCampos
],googleSignIn);

router.get('/',validarJWT, renovarToken);

module.exports = router;
