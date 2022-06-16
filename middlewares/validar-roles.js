const { request, response } = require("express");

const esAdminRole = (req = request, res = response, next) => {
  if (!req.usuarioAuth) {
    return res.status(500).json({
      msg: "Se quiere validar el role sin validar le token primero",
    });
  }

  const { rol, nombre } = req.usuarioAuth;

  if (rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${nombre} no es administrador y no puede hacer esto`,
    });
  }

  next();
};

const tieneRol = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.usuarioAuth) {
      return res.status(500).json({
        msg: "Se quiere validar el role sin validar le token primero",
      });
    }

    if(!roles.includes(req.usuarioAuth.rol)){
        return res.status(401).json({
            msg: `El servicio requiere uno de estos roles ${roles}`,
          });
    }

    next();
  };
};

module.exports = {
  esAdminRole,
  tieneRol,
};
