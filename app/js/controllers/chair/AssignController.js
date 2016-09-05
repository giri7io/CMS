/**
 * Created by Smurf on 8/25/2016.
 */

angular.module('cms')
  .controller('chair.AssignController',['$scope','$http','$element', function($scope,$http,$element){
    $scope.isCollapsed = false;
    $scope.searchTerm;
    $element.find('input').on('keydown', function(ev) {
      ev.stopPropagation();
    });
    $scope.clearSearchTerm = function() {
      $scope.searchTerm = '';
    };
    $http.get("/api/user/sub-list",{params:{"unassigned":true}})
      .then(function(response) { console.log(response)
          $scope.submissions=response.data
        }
      );

    $http.get("/api/reviewers/list").then( function(response){
      $scope.reviewers = response.data
    })


    $scope.assign = function (subid, revid) {
      console.log(subid)
      console.log(revid)
      $http.post("/api/chair/assign",{sub:subid,rev:revid}).then(function (response) {
        console.log(response)
      })
    }

  }]);

