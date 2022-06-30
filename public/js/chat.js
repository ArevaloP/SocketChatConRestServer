
const url = (window.location.hostname.includes('localhost')) ? 
'http://localhost:8080/api/auth/':
'https://restservergjap.herokuapp.com/api/auth/';

let usuario = null;
let socket  = null;

//Referencias HTML
txtUid     = document.querySelector('#txtUid');
txtMensaje = document.querySelector('#txtMensaje');
ulUsuarios = document.querySelector('#ulUsuarios');
ulMensajes = document.querySelector('#ulMensajes');
btnSalir   = document.querySelector('#btnSalir');




//Validar el token del localStorage
const validarJWT = async ()=>{

    const token = localStorage.getItem('x-token') || '';

    if(token.length <= 10 ){
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url, {
        headers: {'x-token': token}
    });

    const {usuarioAuth: userDB, token: tokenDB} = await resp.json();

    localStorage.setItem('x-token', tokenDB);
    usuario = userDB;

    document.title = usuario.nombre;

    await conectarSocket();

}

const conectarSocket = async()=>{
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('x-token')
        }
    });

    socket.on('connect', ()=>{
        console.log('Socket online');
    });
    socket.on('disconnect', ()=>{
        console.log('Socket offline');
    });

    socket.on('recibir-mensaje', dibujarMensajes );
    socket.on('usuarios-activos', dibujarUsuarios );
    socket.on('mensaje-privado', (payload)=>{
        
        console.log(payload);

    });

    
}

const dibujarUsuarios = (usuarios = [])=>{
    
    let userHTML = '';
    usuarios.forEach(({nombre, uid})=>{

        userHTML += `
            <li>
                <p> 
                    <h5 class="text-success">${ nombre }</h5>
                    <span class="fs-6 text-muted">${ uid }</span>
                </p>
            </li>
        `
    });

    ulUsuarios.innerHTML = userHTML;

}

const dibujarMensajes = ( mensajes = [])=>{
    
    let mensajesHTML = '';
    mensajes.forEach(({mensaje, nombre})=>{

        mensajesHTML += `
            <li>
                <p> 
                    <span class="text-primary">${ nombre }</span>
                    <span>${ mensaje }</span>
                </p>
            </li>
        `
    });

    ulMensajes.innerHTML = mensajesHTML;

}

txtMensaje.addEventListener('keyup', ({keyCode})=>{

    const mensaje = txtMensaje.value;
    const uid     = txtUid.value;
    
    if(keyCode !== 13) {return;}
    if(mensaje.trim().length === 0){return;}

    socket.emit('enviar-mensaje', {mensaje, uid});

    txtMensaje.value = '';

});




const main = async () =>{


    //Validar JWT
    await validarJWT();


}


main();

// const socket = io();