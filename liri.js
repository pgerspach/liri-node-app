require("dotenv").config();
var fs = require("fs");
var Spotify = require("node-spotify-api");
var keys = require("./keys");
var spotify = new Spotify(keys.spotify);

var axios = require("axios");
let command = process.argv[2];
let comArgs = "";
if (process.argv[3]) {
  comArgs = parseInput(process.argv.slice(3));
}
whichCommand(command, comArgs);
function whichCommand(command, comArgs) {
  switch (command) {
    case "concert-this":
      concertThis(comArgs);
      break;
    case "spotify-this-song":
      spotifyThis(comArgs);
      break;
    case "movie-this":
      movieThis(comArgs);
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      break;
  }
}
function concertThis(artistName) {
  fs.appendFile("log.txt", "concert-this " + artistName + `\n`, err => {});
  artistName = artistName.split(" ").join("+");

  axios({
    method: "get",
    url: `https://rest.bandsintown.com/artists/${artistName}/events?app_id=codingbootcamp`,
    responseType: "json"
  }).then(response => {
    var i = 0;

    for (let event of response.data) {
      console.log(`Venue name: ${event.venue.name}`);
      fs.appendFile(
        "log.txt",
        `Venue name: ${event.venue.name}` + `\n`,
        err => {}
      );

      console.log(`Venue location: ${event.venue.city}`);
      fs.appendFile(
        "log.txt",
        `Venue location: ${event.venue.city}` + `\n`,
        err => {}
      );

      console.log(`Date: ${event.datetime}`);
      fs.appendFile("log.txt", `Date: ${event.datetime}` + `\n`, err => {});

      console.log("--------------");
      fs.appendFile("log.txt", `------------` + `\n`, err => {});

      i++;
      if (i > 9) break;
    }
  });
}

function movieThis(movieName) {
  movieName = movieName.split(" ").join("+");
  axios({
    method: "get",
    url: `http://www.omdbapi.com/?apikey=trilogy&t=${movieName}&plot=full`
  }).then(response => {
    fs.appendFile("log.txt", "movie-this " + movieName + `\n`, err => {});

    console.log(`Title: ${response.data.Title}`);
    fs.appendFile("log.txt", `Title: ${response.data.Title}` + `\n`, err => {});
    console.log(`Year: ${response.data.Year}`);
    fs.appendFile("log.txt", `Year: ${response.data.Year}` + `\n`, err => {});

    console.log(`Rating: ${response.data.Rated}`);
    fs.appendFile(
      "log.txt",
      `Rating: ${response.data.Rated}` + `\n`,
      err => {}
    );

    console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`);
    fs.appendFile(
      "log.txt",
      `Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}` + `\n`,
      err => {}
    );

    console.log(`Country: ${response.data.Country}`);
    fs.appendFile(
      "log.txt",
      `Country: ${response.data.Country}` + `\n`,
      err => {}
    );

    console.log(`Language: ${response.data.Language}`);
    fs.appendFile(
      "log.txt",
      `Language: ${response.data.Language}` + `\n`,
      err => {}
    );

    console.log(`Plot: ${response.data.Plot}`);
    fs.appendFile("log.txt", `Plot: ${response.data.Plot}` + `\n`, err => {});

    console.log(`Actors: ${response.data.Actors}`);
    fs.appendFile(
      "log.txt",
      `Actors: ${response.data.Actors}` + `\n`,
      err => {}
    );
    fs.appendFile("log.txt", `-----------` + `\n`, err => {});
  });
}
function spotifyThis(songName) {
  songName = songName.split("+").join(" ");
  spotify.search({ type: "track", query: songName }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    let i = 0;
    fs.appendFile("log.txt", `spotify-this-song ${songName}` + `\n`, err => {});

    for (let songItem of data.tracks.items) {
      console.log("Song name: " + songItem.name);
      fs.appendFile("log.txt", "Song name: " + songItem.name + `\n`, err => {});

      console.log(`Artists: `);
      for (let artist of songItem.artists) {
        console.log(`${artist.name}`);
        fs.appendFile("log.txt", "Artist: " + artist.name + `\n`, err => {});
      }
      console.log("Album: " + songItem.album.name);
      fs.appendFile(
        "log.txt",
        "Album: " + songItem.album.name + `\n`,
        err => {}
      );

      console.log("Preview link: " + songItem.preview_url);
      fs.appendFile(
        "log.txt",
        "Preview link: " + songItem.preview_url + `\n`,
        err => {}
      );

      console.log("--------------");
      fs.appendFile("log.txt", "-------------" + `\n`, err => {});

      i++;

      if (i > 4) {
        break;
      }
    }
  });
}
function doWhatItSays() {
  fs.readFile("./random.txt", "utf8", (err, data) => {
    console.log(data);
    data = data.split(",");
    if (data[1][0] == '"' || data[1][0] == "'" || data[1][0] == "`") {
      data[1] = data[1].slice(1, data[1].length - 1);
    }
    data[1] = data[1].split(" ");
    whichCommand(data[0].trim(), parseInput(data[1]));
  });
}
function parseInput(input) {
  console.log("INPUT: " + input);
  if (!input[1]) {
    return input[0].split(" ").join("+");
  } else {
    let returnInput = input[0];
    for (let word of input.slice(1)) {
      returnInput = returnInput + "+" + word;
    }
    console.log("RETIN: " + returnInput);
    return returnInput.trim();
  }
}
