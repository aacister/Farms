
angular.module('boozFarms', ['ui.router'])
.constant('boozConfig', {
  farmApi: 'http://di-interview-project.elasticbeanstalk.com/assignments/fruit/data'
})
.config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: '/home.html',
                    controller: 'MainCtrl',
                    resolve: {
                        farmsResolved: ['farmFactory', function(farmFactory) {
                            return farmFactory.getAll();
                        }]
                    }

                });
                $urlRouterProvider.otherwise('home');
        }
    ])
.factory('farmFactory', ['$http', 'boozConfig', function($http, boozConfig) {
        var o = {
            farms: []
        };

        //Retrieves farm json
        o.getAll = function() {

            return $http.get(boozConfig.farmApi).success(
              function(data) {
                 angular.copy(data.data, o.farms);
            });
        };
        return o;
    }])
    .filter('farmerFilter', [function(){
      //filter results by farmer_id
      return function(data, farmerId){
        //return all if no farm selected in filtering select box
        if(farmerId === '' || farmerId == null)
          return data;

        var result = data.filter(
          function (value) {
           return (value.farmer_id === farmerId);
          }
        )
        return result;
      }
    }])

    .filter('itemFilter', [function(){
      //filter results by item
      return function(data, item){
        //return all if no item selected in filtering select box
        if(item==='' || item == null)
          return data;

        var result = data.filter(
          function (value) {
           return (value.item.toUpperCase() === item.toUpperCase());
          }
        )
        return result;
      }
    }])
    .filter('unique', function() {
    return function(data, key) {
      //unique filter.  Used on select options
        var uniqueKeyList = [];
        var uniqueList = [];
        for(var i = 0; i < data.length; i++){
          var upperUnique = (data[i][key]).toString().toUpperCase();
          console.log('upperUnique: ' + upperUnique);
          console.log('unique data: ' + data[i]);
                //Make sure it is unique regardless of case
          if(uniqueKeyList.indexOf(upperUnique) == -1)
          {
                  console.log(upperUnique);
                  uniqueKeyList.push(upperUnique);
                  uniqueList.push(data[i]);
          }
        }
        return uniqueList;
    };
})
.controller('MainCtrl', ['$scope', '$sce', 'farmFactory', 'farmsResolved',
function($scope, $sce,  farmFactory, farmsResolved){
  $scope.farms = farmsResolved.data;  //returned json, resolved before page load
  $scope.farmerId = '';
  $scope.item='';

  $scope.convertAddress = function(a){
    //Addresses from farm service were being evaluated as string, not json.  Convert it here, and
    //return in format to be displayed
    var json = eval("(" + a + ")");
    return $sce.trustAsHtml(json.address + '<br />' + json.city + ', ' + json.state + ' ' + json.zip);
  }

}]);
