const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConection } = require('../database/config');
const { socketController } = require('../controllers/sockets/controllers');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        //Configuracion de sockets
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths ={
            usuarios: '/api/usuarios',
            auth: '/api/auth',
            categorias: '/api/categorias',
            productos: '/api/productos',
            buscar: '/api/buscar',
            uploads: '/api/uploads'
        }

        //Conectar a base de datos
        this.connDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi app
        this.routes();

        //Sockets
        this.sockets();
    }

    async connDB(){
        await dbConection();
    }

    middlewares(){
        //CORS
        this.app.use(cors());

        //Parseo y lectura del body
        this.app.use(express.json());
        
        //Directorio publico
        this.app.use(express.static('public'));

        //Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp',
            createParentPath: true
        }));
    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    sockets(){
        this.io.on('connection', (socket)=> socketController(socket, this.io));
    }

    listen(){
        this.server.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`);
        });
    }

}

module.exports = Server;