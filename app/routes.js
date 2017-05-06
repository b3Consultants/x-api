var Likes = require('./models/like');

// used to serialize the user for the session
module.exports = function(app) {

  /*app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
      next();
  });*/


  app.post('/api/likes/:lid/song/:song/address/:ip', (req, res) => {
    const like_id = req.params.lid;
    const song_name = req.params.song;
    const ip_address = req.params.ip;
    const time = new Date();
    Likes.find({
      'ip_address': ip_address
    }, {
      limit: 1, // Ending Row
      sort: '-date',
    }, (err, like) => {
      if (err) {
        res.status(500).send(err);
      } else {
        if (like.length != 0) {
          if (time - like.timestamp > 60) {
            Likes.create({
              ip_address: ip_address,
              song: song_name,
              liked: like_id,
              timestamp: time,
            }, (err, like) => {
              if (err) {
                res.status(500).send(err);
              } else {
                res.status(200);
              }
            });
          } else {
            res.status(404).send("Puedes votar cada 1 minuto :(");
          }
        } else {
          Likes.create({
            ip_address: ip_address,
            song: song_name,
            liked: like_id,
            timestamp: time,
          }, (err, like) => {
            if (err) {
              console.log('hola2');
              res.status(500).send(err);
            } else {
              console.log('hola3');
              res.status(200).send("Enhorabuena tu voto ha sido registrado correctamente :)");
            }
          });
        }
      }
    });
    /*Session.find({
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
    });*/
  });
};
