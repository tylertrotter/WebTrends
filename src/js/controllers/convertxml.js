app.controller('ConvertXml', ['$scope', 'x2js', 'getData', function($scope, x2js, getdata) {
    getdata.success(function(data) {
        var x2js = new X2JS();
        var json = x2js.xml2js( data );
        console.log(json);
        $scope.postings = json.rss.channel.item;
    });
}]);
