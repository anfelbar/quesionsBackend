//let mongoose = require('mongoose')
let auth = require("../auth/google.auth");
const express = require("express");
const router = express.Router();

const adminSchema = require("../modelos/admin.model");

// CREATE question
router.route("/add-admin").post((req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    auth(bearer[1])
      .then(() => {
        /// ////////////////////
        adminSchema.create(req.body, (error, data) => {
          if (error) {
            //console.log("the data admin was " + req.body);
            return next(error);
          } else {
            console.log(data);
            res.json(data);
          }
        });
      })
      .catch((error) => {
        //console.log("No autenticado antes google o acabó el tiempo");
        res.json({ results: false });
      });
  } else {
    // Forbidden
    //res.sendStatus(403);
    res.json({ results: false });
  }
});

/// list questions
router.route("/").get((req, res) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    auth(bearer[1])
      .then(() => {
        /// ////////////////////
        adminSchema
          .find()
          .then((admins) => {
            //console.log("creating json in backend preguntas");
            var jsonNuevo = {
              admins: admins,
            };
            res.send(jsonNuevo);
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Error obteniendo admins.",
            });
          });
      })
      .catch((error) => {
        console.log("No autenticado antes google o acabó el tiempo");
        res.json({ results: false });
      });
  } else {
    // Forbidden
    //res.sendStatus(403);
    res.json({ results: false });
  }
});

router.route("/autenticar/").post((req, res, next) => {
  const elquees = req.body.correo;
  //console.log("autenticar req2: j",elquees);
  const request = {
    email: elquees,
  };
  adminSchema
    .findOne(request)
    .then((resultado) => {
      //console.log("resultado es %j", resultado);
      const autenticado = resultado == null ? false : true;
      var jsonNuevo = {
        resultado: autenticado,
      };
      res.send(jsonNuevo);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error obteniendo consulta parametros.",
      });
      return next(error);
    });
});

// Obtener un administrador
router.route("/edit-admin/:id").get((req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    auth(bearer[1])
      .then(() => {
        /// ////////////////////
        adminSchema.findById(req.params.id, (error, data) => {
          if (error) {
            return next(error);
          } else {
            res.json(data);
          }
        });
      })
      .catch((error) => {
        //console.log("No autenticado antes google o acabó el tiempo");
        res.json({ results: false });
      });
  } else {
    // Forbidden
    //res.sendStatus(403);
    res.json({ results: false });
  }

  //console.log("okay, editing admins %j", req.params);
});

// Actualizar administrador
router.route("/update-admin/:id").put((req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    auth(bearer[1])
      .then(() => {
        /// ////////////////////
        adminSchema.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          (error, data) => {
            if (error) {
              console.log(error);
              return next(error);
            } else {
              res.json(data);
              //console.log("Quastion updated successfully !");
            }
          }
        );
      })
      .catch((error) => {
        //console.log("No autenticado antes google o acabó el tiempo");
        res.json({ results: false });
      });
  } else {
    // Forbidden
    //res.sendStatus(403);
    res.json({ results: false });
  }
});

router.route("/delete-admin/:id").delete((req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    auth(bearer[1])
      .then(() => {
        /// ////////////////////
        adminSchema.findByIdAndRemove(req.params.id, (error, data) => {
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
        //console.log("No autenticado antes google o acabó el tiempo");
        res.json({ results: false });
      });
  } else {
    // Forbidden
    //res.sendStatus(403);
    res.json({ results: false });
  }
});

module.exports = router;
