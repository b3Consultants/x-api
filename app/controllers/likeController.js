var Likes = require('../models/like');

module.exports = function(app) {

    app.post('/api/likes/:lid/song/:song/address/:ip', (req, res,next) => {
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
              console.log('hola');
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
              console.log('hola');
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
      });

    app.get('/api/likes/:songName',(req,res,next)=> {
      const songName = req.params.songName;
      let mata=0;
      let apesta=0;
      Likes.find({song: songName },(err,likes)=>{
          if(err){
            res.status(500).send(err);
          }
          for (var i = 0; i < likes.length; i++) {
            if(likes[i].liked =1){
              mata++;
            }else{
              apesta++;
            }
          }
          const response ={
              apesta: apesta,
              mata:mata
          }
          res.status(200).send(response);

      })

    });
    app.get('/api/likes/',(req,res,next)=> {
      const songName = req.params.songName;
      let mata=0;
      let apesta=0;
      Likes.find({},(err,likes)=>{
          if(err){
            res.status(500).send(err);
          }
          for (var i = 0; i < likes.length; i++) {
            if(likes[i].liked =1){
              mata++;
            }else{
              apesta++;
            }
          }
          const response ={
              apesta: apesta,
              mata:mata
          }
          res.status(200).send(response);

      })

    });


}
