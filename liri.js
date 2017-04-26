//load npm packages inquirer, twitter, spotify, moment and request

//use to ask for specific user input and restrict choices
var inquirer = require("inquirer");

//use to get tweets
var twitter = require("twitter");

//use to format tweet dates
var moment = require("moment");

//use to get spotify data
var spotify = require("spotify");

//use to make requests to omdb
var request = require("request");

//get twitter api keys from keys.js
var keys = require("./keys.js");

//get fs node module to read and write to other files
var fs = require("fs");

//make twitter client object
var client = new twitter({
	consumer_key: keys.twitterKeys.consumer_key,
	consumer_secret: keys.twitterKeys.consumer_secret,
	access_token_key: keys.twitterKeys.access_token_key,
	access_token_secret: keys.twitterKeys.access_token_secret
});

function spotifyThis(songName) {


};

//create user command line interface - get user name and command
inquirer.prompt([

	{
	type: "input",
	name: "userName",
	message: "Hi, I'm Liri. What's your name?"
	},

	{
	type: "list",
	name: "command",
	message: "What can I do for you?",
	choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"]
	}

]).then(function(user) {
	switch(user.command) {

		//if command is my-tweets
		case "my-tweets":
			var params = {screen_name: "CatWoala"};
			client.get("statuses/user_timeline", params, function(error, tweets, response){
				console.log("Ok " + user.userName + ", here are my last 20 tweets:");
				for (var i = 0; i < 20; i++) {
					//to get rid of formatting error from moment.js and to work in all browsers
					var formattedDate = moment(tweets[i].created_at, "ddd MMMDD HH:mm:ss Z YYYY");
					
					console.log(moment(formattedDate).fromNow() + " on " + moment(formattedDate).format("MMMM Do YYYY, h:mm a") + ", I tweeted this gem:");
					console.log(tweets[i].text);
				};
			})
			break; // end of if command is my-tweets

		//if command is spotify
		case "spotify-this-song":
			inquirer.prompt([

			{
			type: "input",
			name: "songName",
			message: "Hey " + user.userName + "! What's the title of the song?"
			}

			]).then(function(song) {
				console.log(song.songName);
				spotifyThis(song.songName);
			});
			break;

		//if command is movie-this
		case "movie-this":
			inquirer.prompt([

			{
			type: "input",
			name: "movieName",
			message: "Hey " + user.userName + "! What's the title of the movie?"
			}

			]).then(function(movie) {

				if (movie.movieName === "" ) {
					console.log ("Hey " + user.userName + "! You didn't enter a movie so here's someone else's favorite movie!")
					movie.movieName = "Mr.Nobody";
				}
				
				request("http://www.omdbapi.com/?t=" + movie.movieName + "&y=&tomatoes=true", function(error, response, body){

					if (!error && response.statusCode === 200) {
						
						console.log("Ok " + user.userName + ", here is some information on " + JSON.parse(body).Title + ":");
						console.log("It came out in " + JSON.parse(body).Year + " and it was made in " + JSON.parse(body).Country + " so it's in " + JSON.parse(body).Language + "!");
						console.log(JSON.parse(body).Title + " is about: " + JSON.parse(body).Plot);
						console.log("The main actors are: " + JSON.parse(body).Actors);
						console.log("The IMDB rating is: " + JSON.parse(body).imdbRating);
						//check if Rotten Tomatoes link is available and give appropriate message
						if (JSON.parse(body).tomatoURL !== "N/A") {
							console.log("If you want even more information, you can check out the Rotten Tomatoes reviews of " +  JSON.parse(body).Title + " at " + JSON.parse(body).tomatoURL);
						}
						else {
							console.log("I'm so sorry " + user.userName + ". I don't seem to have a Rotten Tomatoes link for " + JSON.parse(body).Title + ". Maybe you can try IMDB?");
						}	
					}
					else {
						console.log(error);
					}
				})
			});
			break;

		//if command is do what it says
		case "do-what-it-says":
			fs.readFile("random.txt", "utf8", function(error,data) {		
			var randomSong = data;
			console.log(randomSong);
			spotifyThis(randomSong);
			});
			break;

		//don't think I need a default? - add one later if there's another possible case		

	} //end of switch statement

}); // end of .then first set of user input - name and command




