var Likes = require('../models/like');
var Votes = require('../models/vote');

module.exports = function(app, session) {

  app.post('/api/likes/:lid/song/:song', (req, res) => {
    const token = req.sessionID;
    const like_id = req.params.lid;
    const song_name = req.params.song;
    const time = new Date();
    Likes.find({
      'token': token
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
              token: token,
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
            token: token,
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
  });

  app.post('/api/votes/:lid/song/:song', (req, res) => {
    console.log(req.body);
    const token = req.sessionID;
    const vote_id = req.params.lid;
    const song_name = req.params.song;
    const time = new Date();
    Votes.find({
      'token': token
    }, {
      limit: 1, // Ending Row
      sort: '-date',
    }, (err, vote) => {
      if (err) {
        res.status(500).send(err);
      } else {
        if (vote.length != 0) {
          if (time - vote.timestamp > 60) {
            Votes.create({
              token: token,
              song: song_name,
              voted: vote_id,
              timestamp: time,
            }, (err, vote) => {
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
          Votes.create({
            token: token,
            song: song_name,
            voted: vote_id,
            timestamp: time,
          }, (err, vote) => {
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
  });
}
