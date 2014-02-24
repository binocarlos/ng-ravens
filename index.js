var modulename = module.exports = 'ng-ravens';

angular
  .module(modulename, [

  ])

  .directive('ravens', function($http){
    
    return {
      restrict:'EA',
      scope:{
        url:'=',
        key:'='
      },
      template: require('./template'),
      replace: true,
      link:function($scope, $elem, $attrs){

        $scope.data = {};

        $scope.validate = function(){
          if(!$scope.data.email.match(/\@/)){
            $scope.error = 'please enter your email address';
            return false;
          }

          if(!$scope.data.name.match(/\w/)){
            $scope.error = 'please enter your name';
            return false;
          }

          if(!$scope.data.subject.match(/\w/)){
            $scope.error = 'please enter a subject';
            return false;
          }

          if(!$scope.data.message.match(/\w/)){
            $scope.error = 'please enter a message';
            return false;
          }

          $scope.error = null;
          return true;
        }

        $scope.submitcontactform = function(){
          if(!$scope.validate()){
            return;
          }
          $http.post({
            url:$scope.url,
            data:$scope.data
          }).then(function(answer){
            $scope.sent = true;
          }, function(error){
            $scope.error = error;
          })
        }

        $scope.$watch('key', function(key){
          if(key){
            Recaptcha.create(key,
            "recaptchaDiv" + key,
            {
                  theme: "clean",
                  callback: Recaptcha.recaptcha_response_field
            }); 
          }
        })

      }
    };
  })
