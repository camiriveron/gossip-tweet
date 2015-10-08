(function () {
    'use strict';

    angular.module('gossiptweet')
        .controller('mapController', ['$scope', 'uiGmapGoogleMapApi', 'geolocation', "uiGmapObjectIterators",
            'underscore', MapController
        ]);

    function MapController($scope, uiGmapGoogleMapApi, geolocation, uiGmapObjectIterators, underscore) {
        /* jshint validthis: true */
        var mc = this;

        //Functions
        mc.mapReady = mapReady;

        //Constants
        mc.dateRegex = /([A-Za-z]{3}\s[A-Za-z]{3}\s[0-9]{2}\s[\d:]{5}).*/g;
        mc.urlRegex = /(((http(s)?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}[\b/]*)([-a-zA-Z0-9@:%_\+.~#?&//=]*))/g;
        mc.twitterUserRegex = /([\s-!?.,()])?@([a-zA-Z0-9]+)[\s-!?.,()]/g;
        mc.twitterHashtagRegex = /([\s-!?.,()])?#([a-zA-Z0-9]+)([\s-!?#.,()])?/g;

        mc.map = {
            center: { //Default Doupont circle, Washington, DC
                latitude: 38.909634,
                longitude: -77.043356
            },
            tweetsMarkers: [],
            zoom: 13
        };
        mc.mapOptions = {
            minZoom: 3,
            zoomControl: false,
            draggable: true,
            navigationControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            disableDoubleClickZoom: false,
            keyboardShortcuts: true,
            markers: {
                selected: {}
            },
            selectedTweet: {
                show: false
            }
        };

        uiGmapGoogleMapApi.then(mapReady);

        /****** Watchs ********************************************************/

        //When ready center map in current location
        $scope.$watch('hc.coords', function (newValue, oldValue) {
            if (newValue) {
                mc.map.center.latitude = newValue.lat;
                mc.map.center.longitude = newValue.long;
                mc.map.zoom = 14;
            }
        }, true);

        //Watch changes in tweets and update markers on map
        $scope.$watch('hc.tweets', function (newValue, oldValue) {
            if (newValue) {
                var markers = [];
                _.each(newValue, function (marker) {
                    if (marker.geo !== undefined &&
                        marker.geo.latitude !== undefined && marker.geo.longitude !== undefined) {
                        customizeMarker(marker);
                        markers.push(marker);
                    }
                });
                mc.map.tweetsMarkers = markers;
            }
        });

        $scope.$on('hashtagSelected', function (event, args) {
            var hashtag = args.hashtag;
            underscore.each(mc.map.tweetsMarkers, function (marker) {
                underscore.each(marker.hashtags, function (ht) {
                    if (hashtag.text == ht.text) {
                        marker.show = hashtag.selected;
                    }
                });
            });
        });

        /************** Functions  *****************************************/

        function mapReady(maps) {
            mc.maps = maps;
        }

        /************** Aux Functions  *****************************************/

        function customizeMarker(marker) {
            marker.icon = "/assets/img/tweetLocation.png";
            var date = marker.created_at.replace(mc.dateRegex, "\$1");

            //Show url as links to the page
            var text = marker.text.replace(mc.urlRegex, function (url) {
                return '<a href="' + url + '" target="_blank">' + url + '</a>';
            });

            //Show url as links to twitter's users
            text = text.replace(mc.twitterUserRegex, '$1<a href="https://twitter.com/$2" target="_blank">@$2</a> ');

            //Show url as links to twitter's hashtags
            text = text.replace(mc.twitterHashtagRegex, '$1<a href="https://twitter.com/hashtag/$2?src=hash" target="_blank">#$2</a>$3');

            //change call to HTTPS
            marker.profile_image = marker.profile_image.replace("http", "https");

            marker.text = text;
            marker.date = date;
            marker.show = false;

            //Function to show info windows
            marker.onClickMarker = function () {
                marker.show = !marker.show;
                for (var i = 0; i < mc.map.tweetsMarkers.length; i++) {
                    var othermarker = mc.map.tweetsMarkers[i];
                    if (othermarker.id != marker.id) {
                        othermarker.show = false;
                    }
                }
            };
        }

    }
})();