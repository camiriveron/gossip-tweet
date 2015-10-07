(function () {
    'use strict';

    angular.module('gossiptweet', ['uiGmapgoogle-maps', 'geolocation', 'ngResource'])
        .config(function (uiGmapGoogleMapApiProvider) {
            uiGmapGoogleMapApiProvider.configure({
                key: 'AIzaSyCM0Vfj-cBG7nUYNH6GAx58WC3_9-x3qoY',
                v: '3.20',
                libraries: 'visualization'
            });
        });

})();