// Archivo principal del Backend, configuración del servidor
// y otras opciones

var express = require('express'); // Express: Framework HTTP para Node.js
var routes = require('./routes'); // Dónde tenemos la configuración de las rutas
var path = require('path');
var mongoose = require('mongoose'); // Mongoose: Libreria para conectar con MongoDB
var passport = require('passport'); // Passport: Middleware de Node que facilita la autenticación de usuarios
var bodyParser      = require("body-parser");
var cookieParser    = require("cookie-parser");
var methodOverride  = require("method-override");

// Importamos el modelo usuario y la configuración de passport
require('./models/user');
require('./passport')(passport);

// importamos los controladores para la API
require('./models/gasto');
var GastoCtrl = require('./controllers/gastos');

// Conexión a la base de datos de MongoDB que tenemos en local
mongoose.connect('mongodb://localhost:27017/gastos', function(err, res) {
  if(err) throw err;
  console.log('Conectado con éxito a la BD');
});

// Iniciamos la aplicación Express
var app = express();

// Configuración (Puerto de escucha, sistema de plantillas, directorio de vistas,...)
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Ruta de los archivos estáticos (HTML estáticos, JS, CSS,...)
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//app.use(methodOverride());

// Configuración de Passport. Lo inicializamos
// y le indicamos que Passport maneje la Sesión
app.use(passport.initialize());
app.use(passport.session());
//app.use(app.router);

// Si estoy en local, le indicamos que maneje los errores
// y nos muestre un log más detallado
//if ('development' == app.get('env')) {
//  app.use(express.errorHandler());
//}

/* Rutas de la aplicación */
// Cuando estemos en http://localhost:puerto/ (la raiz) se ejecuta el metodo index
// del modulo 'routes'
app.get('/', routes.index);

/* Rutas de Passport */
// Ruta para desloguearse
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});
// Ruta para autenticarse con Twitter (enlace de login)
app.get('/auth/twitter', passport.authenticate('twitter'));
// Ruta para autenticarse con Facebook (enlace de login)
app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email'}));
// Ruta para autenticarse con Google (enlace de login)
app.get('/auth/google', passport.authenticate('google', {
     scope:[ 'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read' ]
}));
// Ruta de callback, a la que redirigirá tras autenticarse con Twitter.
// En caso de fallo redirige a otra vista '/login'
app.get('/auth/twitter/callback', passport.authenticate('twitter',
  { successRedirect: '/', failureRedirect: '/login' }
));
// Ruta de callback, a la que redirigirá tras autenticarse con Facebook.
// En caso de fallo redirige a otra vista '/login'
app.get('/auth/facebook/callback', passport.authenticate('facebook',
  { successRedirect: '/', failureRedirect: '/login' }
));
// Ruta de callback, a la que redirigirá tras autenticarse con Google.
// En caso de fallo redirige a otra vista '/login'
app.get('/auth/google/callback', passport.authenticate( 'google',
  { successRedirect: '/', failureRedirect: '/login' }
));

// API
var GastoR = express.Router();
GastoR.route('/gastos')
    .get(GastoCtrl.findAllGastos)
    .post(GastoCtrl.addGasto);

app.use('/api', GastoR);

// Inicio del servidor
app.listen(app.get('port'), function(){
  console.log('Aplicación Express escuchando en el puerto ' + app.get('port'));
});
