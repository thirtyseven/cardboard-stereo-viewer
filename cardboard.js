
angular.module('viewer', []).controller('picker', function($http, $document, $scope) {
  $http.get('/images').success(function(data) {
    var doc = document.createElement('div');
    doc.innerHTML = data;
    var lis = doc.getElementsByTagName('li');
    var images = [];
    for (var i=0; i < lis.length; i+=2) {
      var leftHref = lis[i].firstChild.pathname; 
      var rightHref = lis[i+1].firstChild.pathname; 
      images.push({left: leftHref, right: rightHref});
    }
    $scope.images = images;
    console.log(images);
  })
  $scope.goToImage = function(image) {
    $scope.viewMode = true;
    $document[0].body.webkitRequestFullscreen();
    $scope.image = image;
  }
  $scope.goBack = function() {
    $scope.viewMode = false;
  }
}).directive('viewer', function() {
  return {
    link: function(scope, element, attrs) {
      var image;
      scope.$watch('image', function(val) {
        if (!val) { return; }
        var leftSrc = '/images/' + val.left;
        var rightSrc = '/images/' + val.right;
        var left = document.createElement('img');
        var right = document.createElement('img');
        left.src = leftSrc;
        right.src = rightSrc;
        var leftReady = false;
        var rightReady = false;
        left.onload = function() {
          leftReady = true;
          maybeDoDraw();
        }
        right.onload = function() {
          rightReady = true;
          maybeDoDraw();
        }
        var maybeDoDraw = function() {
          if (leftReady && rightReady) {
            stereoDraw(element[0], left, right);
          }
          left.remove();
          right.remove();
        }
        
      });
    }
  };
});

function stereoDraw(canvas, left, right) {
  var ctx = canvas.getContext('2d');
  var width = canvas.width/2;
  var height = canvas.height;
  ctx.save();
  ctx.fillRect(0, 0, width*2, height);
  ctx.clearRect(1, 1, width*2-2, height-2);
  ctx.drawImage(left, 0, 0, width, height);
  ctx.translate(width, 0);
  ctx.drawImage(right, 0, 0, width, height);
  ctx.restore();
}

function fullscreen() {
        document.body.webkitRequestFullscreen();
        document.getElementById('fullscreen').remove();
}

function mainLoop() {
  setTimeout(mainLoop, 1000);
}

//mainLoop();
