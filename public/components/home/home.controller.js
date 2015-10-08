(function () {
    'use strict';

    angular.module('gossiptweet')
        .controller('HomeController', ['$scope', '$window', '$document', 'searchTweetsByLocation', 'geolocation',
            'underscore', '$timeout', HomeController
        ]);

    function HomeController($scope, $window, $document, searchTweetsByLocation,
        geolocation, underscore, $timeout) {
        /* jshint validthis: true */
        var hc = this;
        //Functions
        hc.locationReady = locationReady;
        hc.showTweets = showTweets;
        //Variables
        hc.tweets = [];
        hc.coords = { //Default - Doupont Circle, DC
            lat: 38.909634,
            long: -77.043356
        };

        geolocation.getLocation().then(hc.locationReady);
        //Search tweets by default
        var promise = $timeout(function () {
            searchTweets();
        }, 5000);

        /*********** Functions **************************/

        function locationReady(data) {
            //cancel timeout
            $timeout.cancel(promise);
            //Update values in scope
            hc.coords.lat = data.coords.latitude;
            hc.coords.long = data.coords.longitude;
            //Get tweets near the area
            searchTweets();
        }

        function searchTweets() {
            searchTweetsByLocation.query({
                lat: hc.coords.lat,
                long: hc.coords.long,
                dist: '2mi'
            }, function (data) {
                //Apply MapReduce to count number of hashtag's appearance
                var under = underscore.chain(data)
                    .map(mapHashtags).flatten()
                    .reduce(reduceHashtags, {})
                    .value();
                //Order by appearance desc
                under = _.sortBy(under, function (a, b) {
                    return a.value;
                });
                //Reverse to asc sorting
                under = under.reverse();
                //Update model
                hc.hashtags = under;
                hc.tweets = data;
            });
        }

        function showTweets(hashtag) {
            hashtag.selected = !hashtag.selected;
            $scope.$broadcast('hashtagSelected', {
                hashtag: hashtag
            });
        }

        /*********** Aux Functions **************************/

        //Map function to count the number of appearances of hashtags
        function mapHashtags(value, key) {
            var hashtags = [];
            underscore.each(value.hashtags, function (hashtag) {
                hashtags.push({
                    text: hashtag.text,
                    count: 1
                });
            });
            return hashtags;
        }
        //Reduce function to count the number of appearances of hashtags
        function reduceHashtags(counts, item, index, list) {
            counts[item.text] = (counts[item.text] || {});
            counts[item.text].text = item.text;
            counts[item.text].value = (counts[item.text].value || 0) + 1;
            counts[item.text].selected = false;
            return counts;
        }
    }

})();