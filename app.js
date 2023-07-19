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

mongoose.connect('mongodb://127.0.0.1:27017/moviedb');

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


// app.get("/create", async (req, res)=>{
    
//     for(let i=0;i<5;i++){
//         const temp = new Movie({
//             name : "Sherlock Holmes",
//             description : `s02 e0${i}`,
//             url : "https://ia904506.us.archive.org/25/items/the-family-man-s-02-e-09/The%20Family%20Man%20S02E01.mp4"
//         });    

//         await temp.save();
//     }
//     res.send("succesfull..");
// });

app.listen(3000, (req, res) => {
    console.log("listening");
});