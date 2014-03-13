var modulename = module.exports = 'ng-ravens';

angular
  .module(modulename, [

  ])

  .directive('ravens', function($http, $window, $q){
    
    
    function lazyLoadApi(key) {
      var deferred = $q.defer();
      function load_script() {
        if($window.Recaptcha){
          deferred.resolve();
        }
        else{
          setTimeout(load_script, 100);
        }
      }

      var s = document.createElement('script');
      s.src = 'https://www.google.com/recaptcha/api/js/recaptcha_ajax.js';
      document.body.appendChild(s);
      
      // thanks to Emil Stenström: http://friendlybit.com/js/lazy-loading-asyncronous-javascript/
      if ($window.attachEvent) {  
        $window.attachEvent('onload', load_script); 
      } else {
        $window.addEventListener('load', load_script, false);
      }
      return deferred.promise;
    }
    return {
      restrict:'EA',
      scope:{
        url:'=',
        key:'='
      },
      template: require('./template'),
      replace: true,
      link:function($scope, $elem, $attrs){

        function attach_recaptcha(){
          
          Recaptcha.create($scope.key,
            "recaptchaDiv" + $scope.key,
            {
                  theme: "clean",
                  callback: Recaptcha.recaptcha_response_field
            }); 
        }

        if ($window.Recaptcha) {
          attach_recaptcha();
        } else {          
          lazyLoadApi().then(function () {
            if ($window.Recaptcha) {
              attach_recaptcha();
            } else {

            }
          }, function () {
            console.log('Recaptcha promise rejected');
          });
        }

        $scope.data = {};
        $scope.errors = {};

        $scope.validate = function(){
          var ok = true;
          $scope.error = null;  

          if(!($scope.data.email || '').match(/\@/)){
            if(!$scope.error){
              $scope.error = 'please enter your email address';
            }
            $scope.errors.email = true;
            ok = false;
          }
          else{
            $scope.errors.email = false;
          }

          if(!($scope.data.name || '').match(/\w/)){
            if(!$scope.error){
              $scope.error = 'please enter your name';
            }
            $scope.errors.name = true;
            ok = false;
          }
          else{
            $scope.errors.name = false;
          }

          if(!($scope.data.subject || '').match(/\w/)){
            if(!$scope.error){
              $scope.error = 'please enter a subject';
            }
            $scope.errors.subject = true;
            ok = false;
          }
          else{
            $scope.errors.subject = false;
          }

          if(!($scope.data.message || '').match(/\w/)){
            if(!$scope.error){
              $scope.error = 'please enter a message';
            }
            $scope.errors.message = true;
            ok = false;
          }
          else{
            $scope.errors.message = false;
          }

          return ok;
        }

        $scope.submitcontactform = function(){
          if(!$scope.validate()){
            return;
          }

          var recaptcha_challenge_field = $elem.find('#recaptcha_challenge_field');
          var recaptcha_response_field = $elem.find('#recaptcha_response_field');

          $scope.data.recaptcha_challenge_field = recaptcha_challenge_field.val();
          $scope.data.recaptcha_response_field = recaptcha_response_field.val();

          $http.post($scope.url, $scope.data)
          .then(function(res){

            var answer = res.data;

            if(!answer.ok){
              $scope.error = answer.error;
            }
            else{
              $scope.sent = true;  
            }
            
          }, function(error){
            $scope.error = error;
          })
        }

/*
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
*/

      }
    };
  })
