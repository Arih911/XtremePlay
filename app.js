if(process.env.NODE_ENV !=="production"){
    require("dotenv").config();
}

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const Movie = require("./models/movie");


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl) ;

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});



app.get("/home", async (req, res) => {
    const movieList = await Movie.find({});
    // console.log(movieList)
    res.render("home.ejs", {movieList});
});

app.post("/watchShow",  async (req, res) => {
    const rawData = req.body.searchedMovie.toString().toLowerCase();
    let movieArray = rawData.split(" ");
    let movieName = "";
    for(let part of movieArray){
        movieName += `${part.charAt(0).toUpperCase()}${part.substring(1)} `;
    }
    movieName = movieName.trimEnd();
    // console.log(movieName)
    const results = await Movie.find({name : movieName});
    res.render("resultPage", {results, movieName});
});


app.get("/watchShow/:movieName/:id", async(req, res)=>{
    const {id, movieName} = req.params;
    const movie = await Movie.findById(id);
    
    res.render("player", {movie, movieName});
})

app.get("/goBack/:name/:movieName", async (req, res)=>{
    const {name, movieName} = req.params;
    const results = await Movie.find({name:name});
    res.render("resultPage", {results, movieName});
});


app.get("/create", async (req, res)=>{
    res.render("new.ejs");
});

app.get("/delete", async (req, res)=>{
    const movieList = await Movie.find({});
    res.render("delete.ejs", {movieList});
});


app.get("/deleteShow/:id", async (req, res)=>{
    const {id} = req.params;
    await Movie.findByIdAndDelete({_id:id});
    const movieList = await Movie.find({});
    // console.log(id);
    res.render("delete", {movieList});
})



app.post("/create", async (req, res)=>{
    const {name, url} = req.body;
    let description;
    if(req.body.description){
        description = req.body.description;
    }
    const movie = await new Movie({name: name ,url : url});
    if(description){
        movie.description = description;
    }
    await movie.save();
    console.log("success")
    res.redirect("create");
});

app.listen(3000, (req, res) => {
    console.log("listening");
});