app.factory('getData', ['$http', function($http) { 
    var term = 'designer%2c+frontend';
    return $http.get('/js/services/stackoverflow.xml') 
        .success(function(data) { 
            return data; 
        }) 
        .error(function(err) { 
            return err; 
        }); 
}]);