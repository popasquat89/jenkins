'use strict';

var project = require('../../project.json');

module.exports = angular.module(project.name + '.home', [
  'ui.router',
  'toggle-switch'
])
.config(function config( $stateProvider ) {
  $stateProvider.state( 'home', {
    url: '/home',
    controller: 'HomeCtrl',
    templateUrl: '/home/home.tpl.html',
    resolve: {
      user: function (userService) {
        return userService.get();
      }
    }
  });
})
.controller('HomeCtrl', require('./controller.home.js'));