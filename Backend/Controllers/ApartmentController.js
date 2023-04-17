import { Router } from "express";
import { Apartment } from "../Models/Apartment";
const router = Router();

router.post("/addApartment", (req, res) => {
  var newApartment = new Apartment({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    location: req.body.location,
  });
  newApartment
    .save()
    .then((apartment) => {
      res.status(200).send(apartment);
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.get("/getApartments", (req, res) => {
  Apartment.find()
    .then((apartment) => {
      res.status(200).send(apartment);
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.get("/getApartments/:apartment_id", (req, res) => {
  Apartment.findById(req.params.apartment_id)
    .then((apartment) => {
      if (!apartment) {
        throw { err: "Apartment ID not Found" };
      }
      res.status(200).send(apartment);
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

export const apartmentController = router;
