module.exports = function (app, express) {
    //Twitter configuration
    var twitterAPI = require('node-twitter-api');
    var twitter = new twitterAPI({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callback: ''
    });
    var tokens = { //Tokens for accessing the Twitter API
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    };
    //Get an instance of the express Router
    var router = express.Router();

    // Register the routes,
    // all of the routes will be prefixed with /api
    app.use('/api', router);

    //Get tweets api route
    router.get('/tweets', function (req, res) {
        var twitterQuery = {
            //"lang": "en",
            "count": 100
        };
        twitterSearch(req, twitterQuery, tokens.accessToken, tokens.accessTokenSecret,
            function (error, tweets, response) {
                res.json(twitterSearchCallback(error, tweets, response));
            });
    });

    /*************** Functions ***************************************/

    var twitterSearchCallback = function (error, tweets, response) {
        //Parse to JSON
        var jsonTweets = JSON.parse(tweets);
        //Create response JSON
        var resJson = [];
        if (jsonTweets.statuses !== undefined) {
            for (var i = 0; i < jsonTweets.statuses.length; i++) {
                var tweet = jsonTweets.statuses[i];
                resJson.push({
                    id: i,
                    text: tweet.text,
                    geo: {
                        latitude: tweet.coordinates === null ? undefined : tweet.coordinates.coordinates[1],
                        longitude: tweet.coordinates === null ? undefined : tweet.coordinates.coordinates[0]
                    },
                    user_screen_name: tweet.user.screen_name,
                    user_name: tweet.user.name,
                    profile_image: tweet.user.profile_image_url,
                    created_at: tweet.created_at,
                    hashtags: tweet.entities.hashtags
                });
            }
        }
        return resJson;
    };

    var twitterSearch = function (req, twitterQuery, accessToken, accessTokenSecret, callback) {
        //Add query parameters
        if (req.param('geocode') !== undefined) {
            twitterQuery.geocode = req.param('geocode');
        }
        //Call twitter API and call the callback function
        twitter.search(twitterQuery, accessToken, accessTokenSecret, callback);
    };

    var requestToken = function (callback) {
        twitter.getRequestToken(function (error, requestToken, requestTokenSecret, callback) {
            if (error) {
                console.log("Error getting OAuth request token : " + error);
            } else {
                verifyCredentials(requestToken, requestTokenSecret, callback);
            }
        });
    };

    var verifyCredentials = function (accessToken, accessTokenSecret, callback) {
        twitter.verifyCredentials(accessToken, accessTokenSecret, function (error, data, response) {
            if (error) {
                console.error(error);
                console.log("Retrying to get Twitter Access Token...");
                requestToken(callback);
            } else {
                callback(accessToken, accessTokenSecret);
            }
        });
    };

};