const {Socket} = require('socket.io');
const { comprobarJWT } = require('../../helpers/generar-jwt');

const {ChatMensajes} = require('../../models');

const chatMensajes = new ChatMensajes();

const socketController = async(socket = new Socket(), io)=>{

   const token = socket.handshake.headers['x-token'];
    const usuario = await comprobarJWT(token);

    if(!usuario){
        return socket.disconnect();
    }

    //Agregar el usuairio conectado
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    socket.emit('recibir-mensaje', chatMensajes.ultimos10);


    //Concetarlo a una sala especial
    socket.join(usuario.id); 


    
    //Limpiar cuando alguien se desconecta
    socket.on('disconnect', ()=>{
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });

    socket.on('enviar-mensaje', ({uid, mensaje})=>{

        if(uid){
            //Mensaje privado
            socket.to(uid).emit('mensaje-privado', {de: usuario.nombre, mensaje})
        }else{
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
            io.emit('recibir-mensaje', chatMensajes.ultimos10);
        }



    });

}

module.exports = {
    socketController
}
