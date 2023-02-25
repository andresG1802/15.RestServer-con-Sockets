
const express = require('express');
const cors  = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileUpload');
const {createServer} = require('http');
const { socketController } = require('./sockets/controller');
class Server{
    constructor()
    {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app);
        //servidor de sockets
        this.io = require('socket.io')(this.server)
        
        
        this.paths = {
            usuarios:'/api/usuarios',
            buscar:'/api/buscar',
            auth:'/api/auth',
            categorias:'/api/categorias',
            productos:'/api/productos',
            uploads:'/api/uploads'
        }
        // this.usuariosPath = '/api/usuarios';
        // this.authPath = '/api/auth';
        // this.categoriasPath = '/api/categorias';
        
        //Conectar a base de datos
        this.conectarDB();
        
        //Middlewares
        //Los middlewares son funciones
        //que se ejecutan cuando se lanze el 
        //servidor
        
        this.middlewares();

        this.routes();

        //Sockets
        this.sockets();

    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares()
    {
        //CORS
        this.app.use(cors());
        
        //Lectura y parseo del body
        this.app.use(express.json());

        //Directorio publico
       this.app.use(express.static('public')); 
       this.app.use(fileUpload({
        useTempFiles : true,
        tempFileDir : '/tmp/',
        createParentPath:true
    }));
    }
    routes()
    {
        this.app.use(this.paths.auth,require('../routes/auth'));
        this.app.use(this.paths.buscar,require('../routes/buscar'));
        this.app.use(this.paths.usuarios,require("../routes/usuarios"));
        this.app.use(this.paths.categorias,require('../routes/categoria'));
        this.app.use(this.paths.productos,require('../routes/productos'));
        this.app.use(this.paths.uploads,require('../routes/uploads.js'));
    }

    sockets()
    {
        this.io.on('connection', socketController);
    }

    listen()
    {
        //XDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
        this.server.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`)
        });
    }
}
module.exports = Server;
