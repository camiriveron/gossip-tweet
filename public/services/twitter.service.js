(function () {
    'use strict';

    angular
        .module('gossiptweet')
        .factory("searchTweetsByLocation", ['$location', '$resource', function ($location, $resource) {
            return $resource("https://" + $location.host() + "/api/tweets?geocode=:lat,:long,:dist&lang=en&count=200");
        }]);
})();
