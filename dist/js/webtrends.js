//(function(){
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
      for(var i = 0; i < data.length; i++){
        skill = Object.keys(data[i])[0];
        newLi = document.createElement("li");
        newBar = document.createElement("div");
        newP = document.createElement("p");
        newA = document.createElement("a");
        newSpan = document.createElement("span");
        skillText = document.createTextNode(skill);
        percentage = webTrends.utilityFunctions.getPercentage(+data[i][Object.keys(data[i])]);
        skillNum = document.createTextNode(` ${percentage}%`);
        newLi.appendChild(newBar).style.width = percentage + '%';
        newBar.classList.add("percentage-bar");
        newLi.appendChild(newP).appendChild(newA).setAttribute('href', `https://www.google.com/#q=${skill}%20${webTrends.query.job}`);
        newA.appendChild(skillText);
        newP.appendChild(newSpan).appendChild(skillNum);
        newList.appendChild(newLi);
      }
      document.getElementById('data').appendChild(newList);
    },
    changeData: function(job, region, start, end, city){
      var startEnd;
      document.getElementById('data').innerHTML = '';
      document.getElementById('job-heading').innerHTML = job;
      document.getElementById('query-parameters-heading').innerHTML = `In ${region} during ${start} to ${end}`;
      if(region.length){
        region = `&region=${region}`;
      }else{
        region = '';
      }
      if(start.length && end.length){
        startEnd = `&start=${start}&end=${end}`;
      }else{
        startEnd = '';
      }
      this.requestJSON(`http://localhost:8888/src/api/?field=${job}${region}${startEnd}`, webTrends.displaySkills);
    },
    getTotalNum: function(){
      var data = webTrends.json.total;
      var total = 0;
      for(var i = 0; i < data.length; i++){
        total += +data[i][Object.keys(data[i])[0]];
        console.log(data);
      }
      webTrends.total = total;
      document.getElementById('total').innerHTML = webTrends.total;
    },
    utilityFunctions:{
      getPercentage: function(percentage){
        return Math.round((percentage / webTrends.total) * 10000)/100;
      },
      formatDate: function(date){
        return `${date.getFullYear()}-${('0' + (date.getMonth()+1)).substr(-2,2)}-${date.getDate()}`;
      },
      getSiblings: function(n){
        return this.getChildren(n.parentNode.firstChild, n);
      },
      getChildren: function(n, skipMe){
        var r = [];
        for ( ; n; n = n.nextSibling )
           if ( n.nodeType == 1 && n != skipMe)
              r.push( n );
        return r;
      }
    },
    query: {
      region: '',
      job: 'frontend',
      date: {
        start: '',
        end: ''
      }
    }
  };

  var buttons = document.querySelectorAll('.jobs .btn');
  [].forEach.call(buttons, function(button) {
    button.addEventListener('click', function(){
      [].forEach.call(webTrends.utilityFunctions.getSiblings(this), function(otherButton) {
        otherButton.classList.remove('active');
      });
      this.classList.add('active');
      webTrends.query.job = this.getAttribute('data-job');
    });
  });

  document.getElementById('region').addEventListener('change', function(){
    webTrends.query.region = this.value;
  });



  var pickerStart = new Pikaday({
    field: document.getElementById('date-start'),
    onSelect: function(){
      webTrends.query.date.start = webTrends.utilityFunctions.formatDate(this._d);
    }
  });
  var pickerEnd = new Pikaday({
    field: document.getElementById('date-end'),
    onSelect: function(){
      webTrends.query.date.end = webTrends.utilityFunctions.formatDate(this._d);
    },
    defaultDate: 'today'
  });

  document.getElementById('get-results').addEventListener('click', function(){
    webTrends.changeData(webTrends.query.job, webTrends.query.region, webTrends.query.date.start, webTrends.query.date.end);
  });

//})();
