(function(){
  var webTrends = {
    requestJSON: function(endpoint, callback){
      var request = new XMLHttpRequest();
      request.open('GET', endpoint, true);

      request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          webTrends.json = JSON.parse(this.response);
          webTrends.getTotalNum();
          callback();

        } else {
          console.error('Error: ' + this.status);
        }
      };

      request.onerror = function() {
        console.log('There was a connection error of some sort');
      };

      request.send();
    },
    displaySkills: function(){
      var skill;
      var newList = document.createElement("ol");
      var newLi;
      var newBar;
      var newP;
      var newA;
      var newSpan;
      var skillText;
      var percentage = 0;
      var skillNum;
      var data = webTrends.json.total;
      newList.classList.add("skills-list");
      for(var i = 0; i < data.length; i++){
        skill = Object.keys(data[i])[0];
        newLi = document.createElement("li");
        newBar = document.createElement("div");
        newP = document.createElement("p");
        newA = document.createElement("a");
        newSpan = document.createElement("span");
        skillText = document.createTextNode(skill);
        percentage = webTrends.getPercentage(+data[i][Object.keys(data[i])]);
        skillNum = document.createTextNode(` ${percentage}%`);
        newLi.appendChild(newBar).style.width = percentage + '%';
        newBar.classList.add("percentage-bar");
        newLi.appendChild(newP).appendChild(newA).setAttribute('href', `https://www.google.com/#q=${skill}%20front-end%20development`);
        newA.appendChild(skillText);
        newP.appendChild(newSpan).appendChild(skillNum);
        newList.appendChild(newLi);
      }
      document.body.appendChild(newList);
    },
    getTotalNum: function(){
      var data = webTrends.json.total;
      var total = 0;
      for(var i = 0; i < data.length; i++){
        total += +data[i][Object.keys(data[i])[0]];
      }
      webTrends.total = total;
    },
    getPercentage: function(percentage){
      return Math.round((percentage / webTrends.total) * 10000)/100;
    }
  };
  webTrends.requestJSON('http://localhost:8888/src/api/?field=frontend', webTrends.displaySkills);
})();
