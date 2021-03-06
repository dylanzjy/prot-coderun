/**
 * Created by Administrator on 2015/3/26.
 */
angular.module('Image')
    .controller('TerminalCtrl', ['$scope', '$cookieStore','$stateParams', '$location','sharedProperties','Image','$window', TerminalCtrl]);

function TerminalCtrl($scope,$cookieStore,$stateParams,$location,sharedProperties,Image,$window) {
    $scope.apiUrl = "http://" + $location.host() + ":8080/user/";
    //alert($scope.apiUrl);
    $scope.uid = 1;
    $scope.baseimage = $stateParams.base;
    if(sharedProperties.isEdit()) {
        image = sharedProperties.getImage();
        $scope.tag = image.Tag;
    } else if(sharedProperties.isCreate()) {
        $scope.tag = 'latest';
    } else {
        return;
    }
    $scope.commit = function() {
        var image = {};
        if(sharedProperties.isEdit()) {
            image = sharedProperties.getImage();
            image.Tag += 1;
            Image.edit({action:'edit'},image).$promise.then(function(c){
                //$location.path("/term/"+ image.ImageName+"/"+image.basic.Tag);
            }, function(err){
                //$scope.hideLoader();
                //$scope.error = err.data;
                alert("failure");
                return false;
            });
            sharedProperties.imageEdited();
        } else if(sharedProperties.isCreate()) {
            var ni = sharedProperties.getImage();
            image = {
                UserId:ni.UserId,
                ImageName:ni.ImageName,
                Tag:1,
                Descrip:ni.Descrip,
                ImageID:1,
                Star:0,
                Fork:0,
                Comm:0,
                Status:0,
                Date:''
            };
            sharedProperties.imageCreated();
        } else {
            $location.path("/");
        }
        Image.commit({action:'commit'},image).$promise.then(function(c){
            //$location.path("/term/"+ $scope.basic.ImageName);
            alert("创建成功！");
            $window.location.href = "http://" + $location.host()+":9000/dashboard.html#/myimage";
            Image.push({action:'push'},image).$promise.then(function(c) {

            }, function(err) {
                //console.log(err);
                //alert("failure");
                return false;
            });
        }, function(err){
            //$scope.hideLoader();
            //$scope.error = err.data;
            console.log(err);
            alert("failure");
            return false;
        });

    }

}
