var User = require('./models/user');
var Session = require('./models/session');
var Listener = require('./models/listener');
var TempUser = require('./models/tempusers');
var Like = require('./models/like');
var wait = require('async');
var calls = [];
var jwt = require('jsonwebtoken');
var secret = 'YjsrGUhqz95vtSEwWqSe';
var redis = require('redis');
var client = redis.createClient();
// used to serialize the user for the session



module.exports = function(app, nev) {

    nev.configure({
        verificationURL: 'http://lax.uy/email-verification/email-verification.html?code=${URL}',
        persistentUserModel: User,
        tempUserCollection: 'tempusers',

        transportOptions: {
            service: 'Gmail',
            auth: {
                user: 'laequisdev@gmail.com',
                pass: 'laequis2610'
            }
        },
        verifyMailOptions: {
            from: 'Do Not Reply <lax_do_not_reply@gmail.com>',
            subject: 'Por favor confirme su cuenta',
            html: 'Haga click en el siguiente link para confirmar su subscripcion:</p><a href="${URL}">${URL}</a>',
            text: 'Por favor confirme su subscripcion haciendo click en el siguiente link: ${URL}'
        }
    }, function(error, options) {

    });

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        next();
    });

    app.post('/api/email_callback', function(req, res, next) {
        var code = req.body.code;
        TempUser.findOne({
            token: code
        }, function(err, tempuser) {
            if (err) {
                res.status(503).send('Error finding Temp User');
            } else {
                if (!tempuser) {
                    res.status(404).send('Temp User Not Found');
                } else {
                    User.create({
                        email: tempuser.email,
                        password: tempuser.password,
                        name: tempuser.name,
                        method: tempuser.method,
                    }, function(err, newTempUser) {
                        if (err) {
                            res.status(503).send('Error Creating User');
                        } else {
                            TempUser.remove({
                                token: code
                            }, function(err, result) {
                                if (err) {
                                    res.status(503).send('Error removing TempUser');
                                } else {
                                    res.status(200).send('User Created successfuly')
                                }
                            });
                        }
                    });
                }
            }
        });
    });
    // FACEBOOK GMAIL LOG IN
    app.post('/login', function(req, res, next) {
        var id = '';
        var email = req.body.email;
        var name = req.body.name;
        var picture = req.body.picture;
        var api_id = req.body.api_id;
        var method = req.body.method;
        User.findOne({
            api_id: api_id
        }, function(err, user) {
            if (!user) {
                User.create({
                    api_id: api_id,
                    email: email,
                    name: name,
                    picture: picture,
                    method: method,
                }, function(err, todo) {
                    id = todo._id;
                    var sign = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 20);
                    var token = jwt.sign(sign, secret, {});
                    Session.create({
                        email: email,
                        user_id: id,
                        token: token,
                        last_activity: new Date(),
                        picture: picture,
                        method: method
                    }, function(err, session) {
                        var response = {
                            name: name,
                            token: session.token,
                            email: email,
                            picture: picture,
                            user_id: id,
                        };
                        res.json(response);
                    });
                });
            } else {
                id = user._id;
                var sign = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 20);
                var token = jwt.sign(sign, secret, {});
                Session.create({
                    email: email,
                    user_id: id,
                    token: token,
                    last_activity: new Date(),
                    picture: picture,
                    method: method
                }, function(err, session) {
                    var response = {
                        name: name,
                        token: session.token,
                        email: email,
                        picture: picture,
                        user_id: id,
                    };
                    res.json(response);
                });
            }
        });
    });
    // WEB LOGIN
    app.post('/register', function(req, res, next) {
        var token = '';
        var method = req.body.method;
        var password = req.body.password;
        var name = req.body.name;
        var email = req.body.email;
        User.findOne({
            $and: [{
                email: email
            }, {
                method: method
            }]
        }, function(err, user) {
            if (err) {
                res.status(503).send('Error finding User');
            } else {
                if (!user) {
                    TempUser.findOne({
                        email: email
                    }, function(err, tempuser) {
                        if (err) {
                            res.status(503).send('Error finding Temp User');
                        } else {
                            if (!tempuser) {
                                var sign = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 20);
                                token = jwt.sign(sign, secret, {});
                                TempUser.create({
                                    email: email,
                                    password: password,
                                    name: name,
                                    method: method,
                                    token: token
                                }, function(err, newTempUser) {
                                    if (err) {
                                        res.status(503).send('Error Creating TempUser');
                                    } else {
                                        var URL = token;
                                        nev.sendVerificationEmail(email, URL, function(err, info) {
                                            if (err) {
                                                res.status(503).send(err);
                                            } else {
                                                res.status(200).send('Verification Email Send');
                                            }
                                        });
                                    }
                                });
                            } else {
                                res.status(404).send('User Already In TempUser');
                            }
                        }
                    });
                } else {
                    res.status(400).send('User Already Exists');
                }
            }
        });
    });

    app.post('/signIn', function(req, res, next) {
        var finded_user_id = '';
        var finded_user_name = '';
        var email = req.body.email;
        var password = req.body.password
        User.find({
            $and: [{
                email: email
            }, {
                password: password
            }]
        }, function(err, user) {
            if (err) {
                res.status(503).send('Error finding User');
            } else {
                if (user.length != 0) {
                    finded_user_id = user[0]._id;
                    finded_user_name = user[0].name;
                    var sign = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 20);
                    var token = jwt.sign(sign, secret, {});
                    Session.create({
                        email: email,
                        token: token,
                        user_id: finded_user_id,
                        last_activity: new Date(),
                        method: 'WEB_REGISTER'
                    }, function(err, session) {
                        if (err) {
                            res.status(503).send('Error Creating Session');
                        } else {
                            var response = {
                                token: session.token,
                                email: email,
                                name: finded_user_name,
                                user_id: finded_user_id,
                            };
                            res.json(response);
                        }
                    });
                } else {
                    res.status(400).send('Invalid username or password');
                }
            }
        });
    });
    //SING OUT
    app.get('/signOut', function(req, res, next) {
        var token = req.headers.authorization;
        Session.remove({
            token: token
        }).exec(function(err, result) {
            if (err) {
                res.status(400).send('fail to signout');
            } else {
                res.status(200).send('sign out correctly');
            }
        });
    });

    //SESSION AUTHENTICATION
    app.get('/api/ValidateToken', function(req, res, next) {
        var tokenToValidate = req.headers.authorization;
        Session.find({
            token: tokenToValidate
        }).
        exec(function(err, session) {
            if (session.length == 0) {
                res.status(400).send('Not a Valid Token');
            } else {
                res.status(200).send('Active token');
            }
        });
    });

    // LISTENERS
    app.get('/api/GetSessionsFrom/:index', function(req, res, next) {
        var getFrom = parseInt(req.params.index);
        var sessionCount;

        Session.find({}, function(err, sessions) {
            sessionCount = sessions.length;

            if (getFrom <= sessionCount) {

                Session.find({
                    $or: [{
                        method: 'FACEBOOK'
                    }, {
                        method: 'GOOGLE'
                    }]
                }).
                skip(getFrom).
                select('picture').
                exec(function(err, sessions) {
                    if (err) {

                        res.send(err);
                    } else if (!sessions) {

                        res.sendStatus('404');
                    } else {

                        res.send(sessions);
                    }
                });
            } else {
                res.json(sessionCount);
            }
        });
    });

    app.get('/api/get_nro_listeners', function(req, res, next) {
        Listener.count({}, function(err, result) {
            if (err) {
                res.status(503).send('Error Counting Listeners');
            } else {
                res.json(result);
            }
        });
    });

    app.get('/api/getSessionsPics', function(req, res, next) {
        Listener.find().sort({
            $natural: -1
        }).limit(100).exec(function(err, listener) {
            res.send(listener);
        });
    });

    app.get('/api/get_current_song', function(req, res, next) {
        client.get('current_song', function(err, reply) {
            if (err) {
                res.status(503).send('Error Getting Song');
            } else {
                var current_song = reply.split('-');
                var response = {
                    name:current_song[1],
                    artist:current_song[0]
                }
                res.json(response);
            }
        });
    });


    app.post('/api/add_listener', function(req, res, next) {
        var token = req.headers.authorization;
        var user_id = req.body.user_id;
        var user_name = req.body.user_name;
        var user_pic = req.body.user_pic;
        var user_email = req.body.user_email;
        Session.find({
            token: token
        }, function(err, session) {
            if (err) {
                res.status(503).send('Fail to authenticate token');
            } else {
                if (session.length == 0) {
                    res.status(400).send('Not a valid token');
                } else {
                    Listener.find({
                        user_id: user_id
                    }, function(err, listener) {
                        if (err) {
                            res.status(503).send('Fail to authenticate listener');
                        } else {
                            if (listener.length == 0) {
                                Listener.create({
                                    email: user_email,
                                    name: user_name,
                                    picture: user_pic,
                                    user_id: user_id
                                }, function(err, todo) {
                                    if (err) {
                                        res.status(503).send('Fail to create listener');
                                    } else {
                                        res.status(200).send('Listener added successfuly');
                                    }
                                });
                            } else {
                                res.status(200).send('Listener already listening');
                            }
                        }
                    });
                }
            }
        });
    });

    app.post('/api/remove_listener', function(req, res, next) {
        var token = req.headers.authorization;
        var user_id = req.body.user_id;
        Session.find({
            token: token
        }, function(err, session) {
            if (err) {
                res.status(503).send('Fail to authenticate token');
            } else {
                if (session.length == 0) {
                    res.status(400).send('Not a valid token');
                } else {
                    Listener.find({
                        user_id: user_id
                    }, function(err, listener) {
                        if (err) {
                            res.status(503).send('Fail to authenticate listener');
                        } else {
                            if (listener.length == 0) {
                                res.status(503).send('No listener');
                            } else {
                                Listener.remove({
                                    user_id: user_id
                                }, function(err, result) {
                                    if (err) {
                                        res.status(503).send('Error Removing Listener');
                                    } else {
                                        res.status(200).send('Listener Removed')
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    });

    app.post('/api/likeSong',function(req,res,next){
            var token = req.body.token;
            var user_id = req.body.user_id;
            var song= req.body.song;
            var liked = req.body.liked;
            var date = new Date();
            var time = date.getTime();
            Session.find({
                token: token
            }).
            exec(function(err, session) {
                if (session.length == 0) {
                    res.status(400).send('Not a Valid Token');
                }else if(err){
                    res.status(500).send("Error al encontrar la sesión");
                } else {
                    Like.create({
                        user_id: user_id,
                        song: song,
                        liked: liked,
                        time: time,
                    }, function(err, like){
                        if(err){
                            res.status(500).send("Error al agregar el voto");
                        }else{
                            res.status(200);
                        }
                    });
                }
            });
    });

    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
