//load npm packages inquirer, twitter, spotify and request

//use to ask for specific user input and restrict choices
var inquirer = require("inquirer");

//use to get tweets
var twitter = require("twitter");

//use to get spotify data
var spotify = require("spotify");

//use to make requests to omdb
var request = require("request");

//get twitter api keys from keys.js
var keys = require("./keys.js");

var client = keys.twitterKeys;

console.log(client);

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
			var params = {scree_name: "Mary"};
			client.get("statuses/user_timeline", params, function(error, tweets, response){
				console.log(tweets);
			})
			break;

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
			doWhatItSays();
			break;

		default:

	} //end of switch statement

}); // end of .then first set of user input - name and command




