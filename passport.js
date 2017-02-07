var mongoose = require('mongoose');
var User = mongoose.model('User');

//Estrategias de autentificación
var TwitterStrategy = require('passport-twitter').Strategy;