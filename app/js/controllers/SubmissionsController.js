/**
 * Created by Preneesh on 12-08-2016.
 */
angular.module('cms')
  .config(['$mdIconProvider', function($mdIconProvider) {
    $mdIconProvider.icon('md-close', 'img/icons/ic_close_24px.svg', 24);
  }])
  .controller('SubmissionsController', ['$scope','Upload', '$timeout', '$http','$window','currentuser', function($scope,Upload,$timeout,$http,$window,currentuser){
    console.log(currentuser);
    $scope.sub = {};
    $scope.keywords = [];

    $scope.download = function(resource){
      window.open(resource);
    };

    //var id = $routeParams.id;
    $scope.loadSubDetails = function(){
      var req = {
        method: 'get',
        url: '/api/user/submissions'
      };
      $http(req).then(function (result) {
        console.log(result);
        $scope.sub = result.data;
        $scope.keywords = $scope.sub.keywords;
        console.log($scope.sub)
      },function (error) {
        console.error('Error: ' + error);
      })
    };
  
    $scope.submit = function(sub) {
      if(sub == null){
        console.log("form is empty")
      }
      else {
        sub.keywords = $scope.keywords;
        sub.author_id = currentuser.data._id;
        console.log(sub);

        //Data Submission
        var req = {
          method: 'post',
          url: "/api/user/submissions",
          data: sub,
          params: {username: $window.localStorage.username}
        };
        console.log(sub);
        $http(req).then(function (response) {
          console.log(response.data);
          console.log('starting second call...');
          var file = $scope.subFile;

          //File Upload
          Upload.upload({
            url: "/api/user/uploads",
            data: {file: file},
            params: {username: $window.localStorage.username, submission: response.data._id}
          }).then(function (resp) { //upload function returns a promise
            if (resp.data.error_code === 0) { //validate success
              $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
            } else {
              $window.alert('an error occured');
            }
          });

          //Update Notification
          $scope.success = true;
          $timeout(function () {
            $scope.success = false;
          }, 2000);
        }, function (error) {
          console.error('Error: ' + error);
        });
      }
    }
  }]);