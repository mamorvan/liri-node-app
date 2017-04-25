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
				for (var i = 0; i < 20; i++) {
					console.log(moment(tweets[i].created_at).fromNow() + " on " + moment(tweets[i].created_at).format("MMMM Do YYYY, h:mm a") + ", I tweeted this gem:");
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
			message: "What is the title of the song?"
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
			message: "What is the title of the movie?"
			}

			]).then(function(movie) {
				console.log(movie.movieName);
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




