const ytApiKey = process.env.YT_API_KEY;

const request = require("request");

var apilink = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=25";
var ytlink = "https://www.youtube.com/watch?v="

exports.toList = function (videoId){

	let api = apilink + "&playlistId=" + videoId + "&key=" + ytApiKey

	return new Promise((resolve, reject) => {

		let songs = [];

		request.get(api, (error, response, body) =>{

			if(error){
				return songs;
			}

			let json = JSON.parse(body);

			json.items.forEach( elem => {

				let videoId = elem.snippet.resourceId.videoId;
				let videoTitle = elem.snippet.title;

				let song = {
		            title: videoTitle,
		            url: ytlink + videoId
		        }

				songs.push(song);

			});

			resolve(songs);

		});

	});

}