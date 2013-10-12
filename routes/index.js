
/*
 * GET home page.
 */
 
 var gauth = require('./../gauth');
 
 var request = require('request');
 
var parseString = require('xml2js').parseString;

var db = require('./../db');

var APP_URL = process.env.URL || "http://localhost:3000/"
 
exports.index = function(req, res){

  res.render( 'index.html', { loginurl: gauth.loginurl})
    
  if(req.session.tokens)
  {
	res.redirect('/player');
  }

};

exports.player = function(req, res){
	var recUrl = 'http://gdata.youtube.com/feeds/api/users/default/recommendations?v=2&key=' + gauth.v2_key + "&access_token=" + req.session.tokens.access_token;
	console.log(recUrl);
	
	request.get( recUrl,
		function (error, response, body)
		{
			  if (!error && response.statusCode == 200)
			  {
				parseString( body,
					function (err, result)
					{
						videos = [];
						
						i = 0
						while(videos.length < 4)
						{
							var entry = result.feed.entry[i];
							var list = entry.id[0].split(":")
							var id = list[ list.length - 1]
							
							if( videos.indexOf(id) < 0)
							{
								videos.push(id);
								req.session.videos.push(id);
							}
							
							++i;
						}
						
						res.render( 'player.html', { videos: videos, APP_URL: APP_URL})
					}
				);
			  }
			  else
			  {
				res.send("Could not find recommendations.");
			  }
		}  
	)
}

exports.oauth2callback = function(req, res){
  var code = req.query.code;
  gauth.client.getToken( code,
  
   function(err, tokens){
   
   
		req.session.tokens = tokens;
		
		if( !req.session.videos)
		{
			req.session.videos = []
		}
		
		res.redirect('/player');
	}
  );
  
};

exports.socket = function(socket)
{

	var hs = socket.handshake;
	console.log('A socket with sessionID ' + hs.sessionID  + ' connected!');
	socket.emit('success', {});

	socket.on('getvideos', function(data){
		var recUrl = 'http://gdata.youtube.com/feeds/api/users/default/recommendations?v=2&key=' + gauth.v2_key + "&access_token=" + hs.session.tokens.access_token;
		console.log(recUrl);
		
		videos = ['CMdHDHEuOUE', 'CMdHDHEuOUE', 'CMdHDHEuOUE', 'CMdHDHEuOUE']
		socket.emit('newvideos', {videos : videos} );
	});
	
	socket.on('likevideo', function(data){
		
	});


}