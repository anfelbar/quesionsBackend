//let mongoose = require('mongoose')
let auth = require("../auth/google.auth");
let express = require("express"),
  router = express.Router();

// Student Model
let questionSchema = require("../modelos/preguntas.model");
let usuariosSchema = require("../modelos/usuarios.model");

/// list questions
router.route("/").get((req, res) => {  
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    //console.log("QUESIONS: ",bearer);
    auth(bearer[1])
      .then(() => {
        questionSchema
          .find()
          .then((preguntas) => {
            //console.log("creating json in backend preguntas");
            var jsonNuevo = {
              //"response_code": 0,
              results: preguntas,
            };
            res.send(jsonNuevo);
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Error obteniendo usuarios.",
            });
          });
      })
      .catch((error) => {
        console.log("No autenticado antes google o acabó el tiempo")
        res.send({ results: false, });
        
      });
  } else {
    // Forbidden
    //res.sendStatus(403);
    console.log("No autenticado antes google o acabó el tiempo2")
    res.json({ results: false });
  }
});

/// list questions
router.route("/listausuarios").get((req, res) => {
  //console.log("TokenId 2" + req.headers["authorization"]);
  //
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    auth(bearer[1])
      .then(() => {
        //console.log("Nitido, autenticados con token: " + bearer[1]);
        //console.log("Igual");
        usuariosSchema
          .find()
          .then((usuarios) => {
            res.send(usuarios);
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Error obteniendo usuarios.",
            });
          });
      })
      .catch((error) => {
        //console.log("No autenticado antes google o acabó el tiempo")
        res.json({ results: false });
        
      });
  } else {
    // Forbidden
    //res.sendStatus(403);
    res.json({ results: false });
  }
});

// Get Single Student
router.route("/usuarios/:id").get((req, res, next) => {
  //console.log("okay, editing ");
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    auth(bearer[1])
      .then(() => {
        //console.log("Nitido, autenticados con token: " + bearer[1]);
        //console.log("Igual");
        usuariosSchema.findOne(req.params.email, (error, data) => {
          if (error) {
            return next(error);
          } else {
            res.json(data);
          }
        });
      })
      .catch((error) => {
        //console.log("No autenticado antes google o acabó el tiempo")
        res.json({ results: false });
        
      });
  } else {
    // Forbidden
    //res.sendStatus(403);
    res.json({ results: false });
  }
});

// CREATE question
router.route("/create-question").post((req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    auth(bearer[1])
      .then(() => {
        ///////////////////////
        questionSchema.create(req.body, (error, data) => {
          if (error) {
            //console.log("the data was " + req.body);
            return next(error);
          } else {
            //console.log(data);
            res.json(data);
          }
        });
      })
      .catch((error) => {
        //console.log("No autenticado antes google o acabó el tiempo")
        res.json({ results: false });
        
      });
  } else {
    // Forbidden
    res.json({ results: false });
    //res.sendStatus(403);
  }
});

// CREATE question
router.route("/create-user").post((req, res, next) => {
  // console.log("aqui create user");
  // console.log("req: %j", req.body);
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    //console.log("CREATE USER: ",bearer);
    /*auth(bearer[1])
      .then(() => {*/
        ///////////////////////
        const arreglo = [1, 2, 5, 3];
        var query = { email: req.body.email },
          update = {
            puntaje: req.body.puntaje,
            tiempo: req.body.tiempo,
            tiempoRespuestas: arreglo,
            erroresRespuestas: req.body.erroresRespuestas,
          },
          options = { upsert: true };

        usuariosSchema.findOneAndUpdate(query, update, options, function (
          error,
          result
        ) {
          if (error) {
            console.log("No se actualizo nada: " + error);
            return;
          }
          // console.log("Todo bien mi con actualización ", query);
          res.json(req.body);
        });
      /*})
      .catch((error) => {
        //console.log("No autenticado antes google o acabó el tiempo")
        res.json({ results: false });
        
      });*/
  } else {
    // Forbidden
    //res.sendStatus(403);
    res.json({ results: false });
  }
});

// Get Single Student
router.route("/edit-question/:id").get((req, res, next) => {
  //console.log("okay, editing ");
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    auth(bearer[1])
      .then(() => {
        ///////////////////////
        questionSchema.findById(req.params.id, (error, data) => {
          if (error) {
            res.status(500).send({
              message: err.message || "Error obteniendo usuarios.",
            });
            return next(error);
          } else {
            res.json(data);
          }
        });
      })
      .catch((error) => {
        //console.log("No autenticado antes google o acabó el tiempo")
        res.json({ results: false });
        
      });
  } else {
    // Forbidden
    res.json({ results: false });
  }
});

// Update Student
router.route("/update-question/:id").put((req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    auth(bearer[1])
      .then(() => {
        ///////////////////////
        questionSchema.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          (error, data) => {
            if (error) {
              //console.log(error);
              return next(error);
            } else {
              res.json(data);
              //console.log("Quastion updated successfully !");
            }
          }
        );
      })
      .catch((error) => {
        //console.log("No autenticado antes google o acabó el tiempo")
        res.json({ results: false });
        
      });
  } else {
    // Forbidden
    res.sendStatus(403);
  }
});

// Update Student
router.route("/update-user/:id").put((req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    auth(bearer[1])
      .then(() => {
        ///////////////////////
        usuariosSchema.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          (error, data) => {
            if (error) {
              //console.log(error);
              return next(error);
            } else {
              res.json(data);
              //console.log("Usuario updated successfully !");
            }
          }
        );
      })
      .catch((error) => {
        //console.log("No autenticado antes google o acabó el tiempo")
        res.json({ results: false });
        
      });
  } else {
    // Forbidden
    //res.sendStatus(403);
    res.json({ results: false });
  }
});

// Delete Student
router.route("/delete-question/:id").delete((req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    auth(bearer[1])
      .then(() => {
        /// ////////////////////
        questionSchema.findByIdAndRemove(req.params.id, (error, data) => {
          if (error) {
            return next(error);
          } else {
            res.status(200).json({
              msg: data,
            });
          }
        });
      })
      .catch((error) => {
        //console.log("No autenticado antes google o acabó el tiempo")
        res.json({ results: false });
        
      });
  } else {
    // Forbidden
    //res.sendStatus(403);
    res.json({ results: false });
  }
});

module.exports = router;
