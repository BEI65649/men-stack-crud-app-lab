const dotenv = require("dotenv");

dotenv.config();

const express = require('express');

const mongoose = require("mongoose");

const app = express();

const Planet = require("./models/planet.js");

const methodOverride = require("method-override");

const morgan = require("morgan");

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));


//I.N.D.U.C.E.S
//Home/Root
app.get("/", async (req, res) => {
    res.render("home.ejs");
  });
//Index
  app.get("/planets", async (req, res) => {
    const allPlanets = await Planet.find()
    res.render("planets/index.ejs", {planets: allPlanets});
    console.log(allPlanets)
  })

  //new
app.get("/planets/new", (req, res) => {
    res.render("planets/new.ejs");
  });


//Delete
app.delete('/planets/:planetId', async (req, res) => {
    await Planet.findByIdAndDelete(req.params.planetId);
  res.redirect("/planets");
});

//Update
// server.js

app.put("/planets/:planetId", async (req, res) => {
    await Planet.findByIdAndUpdate(req.params.planetId, req.body);
    res.redirect(`/planets/${req.params.planetId}`);
  });
  


//Create

app.post("/planets", async (req, res) => {
    const {name, description} = req.body;
    console.log(`Creating planet with name: ${name}`);
    console.log(`Planet description: ${description}`);
    const newPlanet = new Planet({ name, description });
    await newPlanet.save();  
    console.log(`Planet created successfully with ID: ${newPlanet._id}, Name: ${newPlanet.name}, Description: ${newPlanet.description}`);
    res.redirect('/planets');
  });

  //Edit
  app.get("/planets/:planetId/edit", async (req, res) => {
    const foundPlanet = await Planet.findById(req.params.planetId);
    res.render('planets/edit.ejs', {
        planet: foundPlanet
    })
  });

  //Show
  app.get("/planets/:planetId", async (req, res) => {
    const foundPlanet = await Planet.findById(req.params.planetId)
    res.render("planets/show.ejs", {planet: foundPlanet});
  })

app.listen(3001, () => {
    console.log('Listening on port 3001');
  });













//   app.post('/planets', async(req, res) => {
//     const planetName = display(`What is your name?`)
//     const planetDescription = diplay(`Describe your planet`)
//     const planetImageUrl = display(`Image`)
//     const planet = await planet.create({name: planetName, description: planetDescription, image: planetImageUrl})
//     console.log(`id:${planet._id}, Name: ${planet.name}, Description: ${planet.description}, Image: ${planet.imageurl}`)
// })










//   Create
//   app.post("/planets", async (req, res) => {
//     try {
//     const {name, description, image} = req.body;
//     if (!image) {
//         req.body.image = "https://example.com/default-planet.jpg";
//     }
//     await Planet.create(req.body);
//     res.redirect("/planets/new");
//   } catch (err) {
//     res.status(500).json({message: err.message});
//   }
//   });

