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

//to check if spotify song input was blank or actually The Sign
var noSongInput = false;

//use for spotify-this and do-what-it-says
function spotifyThis(songName) {
	spotify.search({
		type: "track",
		query: songName
	}, function(error, data) {
		if (error) {
			console.log("Sorry I've encountered an error! Here's more details if they're useful to you: " + error);
			return;
		};
	
		//to only get The Sign by Ace of Base - no randomization 
		//in case of no user input, this is default but will also work if user inputs The Sign so use noSongInput var to keep track
		if (songName === "The Sign" && noSongInput === true) {
			//console and log title and artist(s)
			console.log(data.tracks.items[3].name + " by "  + data.tracks.items[3].artists[0].name);
			fs.appendFile("log.txt", data.tracks.items[3].name + " by "  + data.tracks.items[3].artists[0].name + "\n", function(error){
				if (error){
					console.log("There was an error adding data to log. Details: " + error);
				}
			});
			//console and log album title
			console.log("It's from the album called " + data.tracks.items[3].album.name);
			fs.appendFile("log.txt", "It's from the album called " + data.tracks.items[3].album.name + "\r", function(error){
				if (error){
					console.log("There was an error adding data to log. Details: " + error);
				}
			});
			//console and log preview url
			console.log("You can even listen to part of the song at " + data.tracks.items[3].preview_url);
			fs.appendFile("log.txt", "You can even listen to part of the song at " + data.tracks.items[3].preview_url + "\r", function(error){
				if (error){
					console.log("There was an error adding data to log. Details: " + error);
				}
			});
			//console and log extra message
			console.log("You probably should have picked your own title!");
			fs.appendFile("log.txt", "You probably should have picked your own title!" + "\r", function(error){
				if (error){
					console.log("There was an error adding data to log. Details: " + error);
				}
			});
			
 		} //end of if no title was input

 		else{
 			//if no song data is returned 
 			if (data.tracks.items[0] === undefined) {
 				console.log("I'm sorry :( I can't find that song.  Can you check your spelling or try another song?");
 				fs.appendFile("log.txt", "I'm sorry :( I can't find that song.  Can you check your spelling or try another song?\n", function(error){
					if (error){
						console.log("There was an error adding data to log. Details: " + error);
					}
				});
 			}
 			//return one information for 1 random song from list of title matches
			else {
				var randomSongIndex = Math.floor(Math.random() * (data.tracks.items.length));
				//console and log song title 
				console.log("Is this the right " + data.tracks.items[randomSongIndex].name + "?  If not, try again and you might get a different " + data.tracks.items[randomSongIndex].name + "! Fun, right?");
				fs.appendFile("log.txt", "Is this the right " + data.tracks.items[randomSongIndex].name + "?\r If not, try again and you might get a different " + data.tracks.items[randomSongIndex].name + "! Fun, right?\n", function(error){
					if (error){
						console.log("There was an error adding data to log. Details: " + error);
					}
				});
				//console and log the artist(s)
				console.log("The artist(s) are: ");
				fs.appendFile("log.txt", "The artist(s) are: \r", function(error){
					if (error){
						console.log("There was an error adding data to log. Details: " + error);
					}
				});
				for (var i = 0; i < data.tracks.items[randomSongIndex].artists.length; i++) {
					console.log(data.tracks.items[randomSongIndex].artists[i].name);
					fs.appendFile("log.txt", data.tracks.items[randomSongIndex].artists[i].name + "\r", function(error){
						if (error){
							console.log("There was an error adding data to log. Details: " + error);
						}
					});
				};
				//console and log the album
				console.log("It's from the album called " + data.tracks.items[randomSongIndex].album.name);
				fs.appendFile("log.txt", "It's from the album called " + data.tracks.items[randomSongIndex].album.name + "\r", function(error){
						if (error){
							console.log("There was an error adding data to log. Details: " + error);
						}
				});
				//console and log the preview url
				console.log("You can even listen to part of the song at " + data.tracks.items[randomSongIndex].preview_url);
				fs.appendFile("log.txt", "You can even listen to part of the song at: \r" + data.tracks.items[randomSongIndex].preview_url + "\r", function(error){
					if (error){
						console.log("There was an error adding data to log. Details: " + error);
					}
				});
			}//end of else return a random title match
		}//end of else a song was entered
	})//end of spotify search
};//end of spotifyThis function

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
				//console and log intro
				console.log("Ok " + user.userName + ", here are my last 20 tweets:");
				fs.appendFile("log.txt", "Ok " + user.userName + ", here are my last 20 tweets:\r", function(error){
						if (error){
							console.log("There was an error adding data to log. Details: " + error);
						}
				});

				for (var i = 0; i < 20; i++) {
					//to get rid of formatting error from moment.js and to work in all browsers
					var formattedDate = moment(tweets[i].created_at, "ddd MMMDD HH:mm:ss Z YYYY");
					//console and log last 20 tweet dates
					console.log(moment(formattedDate).fromNow() + " on " + moment(formattedDate).format("MMMM Do YYYY, h:mm a") + ", I tweeted this gem:");
					fs.appendFile("log.txt", moment(formattedDate).fromNow() + " on " + moment(formattedDate).format("MMMM Do YYYY, h:mm a") + ", I tweeted this gem:\r", function(error){
						if (error){
							console.log("There was an error adding data to log. Details: " + error);
						}
					});
					//console and log last 20 tweets
					console.log(tweets[i].text);
					fs.appendFile("log.txt", tweets[i].text + "\r", function(error){
						if (error){
							console.log("There was an error adding data to log. Details: " + error);
						}

					});
				} // end of for loop
			}); //end of call to twitter
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
				//if user doesn't enter a song title
				if (song.songName === "" || song.songName === ";") {
				console.log ("Hey " + user.userName + "! You didn't enter a song so here's someone else's favorite song!")
				song.songName = "The Sign";
				noSongInput = true;
				};

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
					fs.appendFile("log.txt", "Hey " + user.userName + "! You didn't enter a movie so here's someone else's favorite movie!\r", function(error){
						if (error){
							console.log("There was an error adding data to log. Details: " + error);
						}

					});

					movie.movieName = "Mr.Nobody";
				}
				
				request("http://www.omdbapi.com/?t=" + movie.movieName + "&y=&tomatoes=true", function(error, response, body){
					if (error) {
						console.log("Sorry I've encountered an error! Here's more details if they're useful to you: " + error);
						return;
					}

					//if no movie data is returned 
 					if (JSON.parse(body).Title === undefined) {
 						console.log("I'm sorry :( I can't find that movie.  Can you check your spelling or try another song?");
 						fs.appendFile("log.txt", "I'm sorry :( I can't find that movie.  Can you check your spelling or try another movie?\r", function(error){
							if (error){
								console.log("There was an error adding data to log. Details: " + error);
							}

						});
 					}

 					//if movie data is returned
					else {
						//console and log movie title
						console.log("Ok " + user.userName + ", here is some information on " + JSON.parse(body).Title + ":");
						fs.appendFile("log.txt", "Ok " + user.userName + ", here is some information on " + JSON.parse(body).Title + ":\r", function(error){
							if (error){
								console.log("There was an error adding data to log. Details: " + error);
							}
						});
						//console and log year, country and language
						console.log("It came out in " + JSON.parse(body).Year + " and it was made in " + JSON.parse(body).Country + " so it's in " + JSON.parse(body).Language + "!");
						fs.appendFile("log.txt", "It came out in " + JSON.parse(body).Year + " and it was made in " + JSON.parse(body).Country + " so it's in " + JSON.parse(body).Language + "!\r", function(error){
							if (error){
								console.log("There was an error adding data to log. Details: " + error);
							}
						});
						//console and log plot
						console.log(JSON.parse(body).Title + " is about: " + JSON.parse(body).Plot);
						fs.appendFile("log.txt", JSON.parse(body).Title + " is about: " + JSON.parse(body).Plot + "\r", function(error){
							if (error){
								console.log("There was an error adding data to log. Details: " + error);
							}
						});
						//console and log actors
						console.log("The main actors are: " + JSON.parse(body).Actors);
						fs.appendFile("log.txt", "The main actors are: " + JSON.parse(body).Actors + "\r", function(error){
							if (error){
								console.log("There was an error adding data to log. Details: " + error);
							}
						});
						//console and log imdb rating
						console.log("The IMDB rating is: " + JSON.parse(body).imdbRating);
						fs.appendFile("log.txt", "The IMDB rating is: " + JSON.parse(body).imdbRating + "\r", function(error){
							if (error){
								console.log("There was an error adding data to log. Details: " + error);
							}
						});

						//check if Rotten Tomatoes link is available and console/log appropriate message
						if (JSON.parse(body).tomatoURL !== "N/A") {
							console.log("If you want even more information, you can check out the Rotten Tomatoes reviews of " +  JSON.parse(body).Title + " at " + JSON.parse(body).tomatoURL);
							fs.appendFile("log.txt", "If you want even more information, you can check out the Rotten Tomatoes reviews of " +  JSON.parse(body).Title + " at " + JSON.parse(body).tomatoURL + "\r", function(error){
								if (error){
									console.log("There was an error adding data to log. Details: " + error);
								}
							});
						}
						else {
							console.log("I'm so sorry " + user.userName + ". I don't seem to have a Rotten Tomatoes link for " + JSON.parse(body).Title + ". Maybe you can try IMDB?");
							fs.appendFile("log.txt", "I'm so sorry " + user.userName + ". I don't seem to have a Rotten Tomatoes link for " + JSON.parse(body).Title + ". Maybe you can try IMDB?\r", function(error){
								if (error){
									console.log("There was an error adding data to log. Details: " + error);
								}
							});
						}	
					}	
					
				}) //end of request to omdb
			}); //end of .then for user input movie title
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




