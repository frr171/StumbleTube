var googleapis = require('googleapis');
OAuth2Client = googleapis.OAuth2Client;

//Google OAuth
var CLIENT_ID = '110889257420.apps.googleusercontent.com';
exports.CLIENT_ID = CLIENT_ID;

var CLIENT_SECRET = 'yH4Azb_hwLlawzKtbO_1y2tO';
var REDIRECT_URL = 'http://stumbletube.herokuapp.com/oauth2callback';

exports.oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

exports.scopes = "https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/youtube";

exports.loginurl = oauth2Client.generateAuthUrl({
	  access_type: 'offline',
	  scope: gauth.scopes
	});