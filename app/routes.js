var Like = require('./models/like');

// used to serialize the user for the session
module.exports = function(app) {

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        next();
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
