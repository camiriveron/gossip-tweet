(function () {
    'use strict';

    angular.module('gossiptweet')
        .factory('underscore', function () {
            return window._; // assumes underscore has already been loaded on the page
        });

})();