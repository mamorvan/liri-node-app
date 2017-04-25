
// var request = require("request");

var command = process.argv[2];
var title = process.argv[3];

function tweets() {
	//code if command is tweet
	console.log(command);
}

function spotify() {
	//code if command is spotify
	console.log(command);
}

function movie() {
	
}

function doWhatItSays() {
	//code if command is do what it says
	console.log(command);
}

switch(command) {
	case "my-tweets":
		// tweets();
		break;

	case "spotify-this-song":
		spotify();
		break;

	case "movie-this":
		movie();
		break;

	case "do-what-it-says":
		doWhatItSays();
		break;

	default:
		console.log("Please enter one of the following commands: my-tweets, spotify-this-song 'song name here', movie-this 'movie name here' or do-what-it-says");
}

