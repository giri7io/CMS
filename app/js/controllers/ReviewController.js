/**
 * Created by bvvis on 20-Jun-16.
 */
angular.module('cms')
    .controller('ReviewController',['$scope','$http', 'userService','$stateParams','config',
        function($scope,$http,userService,$stateParams,config) {
        $scope.review = {}
        $scope.review.submission_id = $stateParams.submissionId;

        userService.currentUser().then(function (response) {
            $scope.currentuser = response.data
            $scope.review.reviewer_id =  response.data._id
            }
        )

        $scope.reviewerExpertise = [
            { label: 'Not familiar w/ the topic', value: '1' },
            { label: 'Familiar', value: '2' },
            { label: 'Average', value: '3' },
            { label: 'Good', value: '4' },
            { label: 'Expert', value: '5' }
        ];

        $scope.overallEvaluation = [
            { label: 'strong reject', value: '1' },
            { label: 'reject', value: '2' },
            { label: 'onHold', value: '3' },
            { label: 'accept', value: '4' },
            { label: 'strong accept', value: '5' }
        ];
        
        $scope.getReview = function () {
            // write  http get review here
            var req = {
                method: 'get',
                url: "/api/user/review",
                params: {submissionId : $stateParams.submissionId}
            };
            $http(req).then(function (result) {
                console.log(result);
                if(result.data == null){
                    return
                }
                else{

                    $scope.review = result.data
                }
            })
        }
        $scope.submitReview = function(){

            console.log($scope.review)
            $scope.data=JSON.stringify($scope.review);

            var req = {
                method: 'post',
                url: "/api/user/review",
                data: $scope.review
            };
            // Send it
            $http(req)
                .then(
                    function(response){
                        // Success callback
                        console.log(response);
                        if(response.data._id){
                            $scope.showSuccess=true;
                        }
                    },
                    function(response){ //Error callback
                        console.log(response)
                    }
                );
        };

    }]);