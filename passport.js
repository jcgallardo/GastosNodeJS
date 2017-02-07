var mongoose = require('mongoose');
var User = mongoose.model('User');

//Estrategias de autentificación
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./config');

module.exports = function(passport){
	//Serializa al usuario para almacenarlo en la sesión
	passport.serializeUser(function(user,donde){
		done(null,user);
	});
	// Deserializa el objeto usuario almacenado en la sesión
	passport.deserializeUser(function(objt,done){
		done(null,obj);
	});
	// Configuración del autenticado para Twitter
	passport.use(new TwitterStrategy({
		consumerKey		: config.twitter.key,
		consumerSecret 	: config.twitter.secret,
		callbackURL		: '/auth/twitter/callback'
	},function(accessToken, refreshToken, profile, done){
		User.findOne({provider_id:profile.id},function(err,user){
			if (err) throw(err);
			if (!err && user!=null) return done(null,user);
			var user = new User({
				provider_id		: profile.id,
				provider		: profile.provider,
				name			: profile.displayName,
				photo			: profile.photos[0].value
			});
			// ... y lo almacena en la base de datos
			user.save(function(err){
				if (err) throw(err);
				done(null,user);
			});
		});
	}));
	
	// Configuración del autenticado para Facebook
	passport.use(new FacebookStrategy({
		clientID		: config.facebook.id,
		clientSecret	: config.facebook.secret,
		callbackURL		: '/auth/facebook/callback',
		profileFields	: ['id','displayName','provider','photos']
	}, function(accessToken, refreshToken, profile, done){
		User.findOne({provider_id:profile.id},function(err,user){
			if (err) throw(err);
			if (!err && user!=null) return done(null,user);
			var user = new User({
				provider_id		: profile.id,
				provider		: profile.provider,
				name			: profile.displayName,
				photo			: profile.photos[0].value
			});
			user.save(function(err){
				if (err) throw(err);
				done(null,user);
			});
		});
	}))
}