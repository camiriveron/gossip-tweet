(function () {
    'use strict';

    angular
        .module('gossiptweet')
        .factory("searchTweetsByLocation", ['$location', '$resource', function ($location, $resource) {
            var res = $resource("https://" + $location.host() + ":55555/api/tweets?geocode=:lat,:long,:dist&lang=en&count=200");
            return res;
        }]);
})();