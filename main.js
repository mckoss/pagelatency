// Scratch - a sample Pageforest Application
namespace.lookup('com.pageforest.pagelatency').defineOnce(function (exports) {
    var require = namespace.lookup;
    var clientLib = require('com.pageforest.client');

    exports['main'] = main;
  exports['loaded'] = loaded;
  exports['go'] = go;
  exports['save'] = save;
  //exports['addTarget'] = addTarget;
  //exports['removeTarg'] = removeTarg;
  exports['drawChart'] = drawChart;
  
  
  var jsonblob = {blob: { target:"http://www.cwkoss.com" },
                  title: "A default document title.",
                  readers: ["public"],
                  writers: ["public"]};
  
    var client;
    var app;
  var storage;


  var loadcount = 0;
  var loaddelay = 1000;
  var targUrl = "";
  var starttime = new Date().getTime();
  var totalload = 0;
  var contload = false;   
  var latencyTimes = [];
  var domainStart = starttime;
  
  
  var activeTargets = [];
  
  /*function addTarget() {
    activeTargets.push(document.getElementById("targetUrl").value);
    drawTargets();
  }
  
  function drawTargets() {
    document.getElementById("testcontainer").innerHTML = "";
    for(var i = 0; i < activeTargets.length; i++) {
      var temp = document.createElement('div');
      temp.id = "targBox" + i;
      temp.className = "targBox";
      temp.innerHTML = '<iframe id="myframe' + i + '" src="' + activeTargets[i] + '" onload="pagelatency.loaded();"></iframe>' +
                 '' + activeTargets[i] + ' <input type="button" value="X" onclick="pagelatency.removeTarg(' + i + ')" />';
      console.log(temp.innerHTML);
      document.getElementById("testcontainer").appendChild(temp);
        //'<div class="targBox" id="targBox' + i + '">' + 
        //'<iframe id="myframe' + i + '" src="' + activeTargets[i] + '" onload="pagelatency.loaded();" />' +
       // activeTargets[i] + '<input type="button" value="X" onclick="pagelatency.removeTarg(' + i + ')" /></div>';
    }
  }*/
  
  function removeTarg(position) {
    activeTargets.splice(position, 1);
    drawTargets();
  }
  
  function loaded() {
    loadcount++;
    var lasttime = new Date().getTime() - starttime;
    latencyTimes.push({ms:lasttime, when:new Date().getTime()});
    drawChart();
    totalload += lasttime;
    $("#stats").text("Last Load Time: " + lasttime + 
      "ms,  Load Count: " + loadcount + " Average Load Time: " + parseInt(totalload/loadcount) +
      "ms");
    if(contload)
      setTimeout(reload, loaddelay);
  }
  
  function toggleButton() {
    if(document.getElementById("gobutton").value == "Go") {
      document.getElementById("gobutton").value = "Stop";
    } else {
      document.getElementById("gobutton").value = "Go";
    }
  }
  
  function stop() {
    contload = false;
    toggleButton();
    loadcount = 0;
    totalload = 0;
    
    
  }
  
  function go() {
    if(document.getElementById("gobutton").value == "Stop")
      stop();
    else {
      setDelay();
      toggleButton();
      contload = true;
      reload();
    }
  }
  
  function setDelay(){
    loaddelay = parseInt(document.getElementById("selectTime").value);   
  }
  
  function reload(){
    targUrl = document.getElementById("targetUrl").value;
    document.getElementById("myframe").src = targUrl + "?" + Math.random();
    starttime = new Date().getTime();
  }
  
  function save() {
    storage.putDoc("masterblob", jsonblob, function(){alert("putDoc");});
    storage.getDoc("masterblob", getTarget);

    //storage.getDoc("masterblob", function(){alert("getDoc");});
  }
  
  function getTarget(docreturn) {
    console.log(docreturn);
    document.getElementById("targetUrl").value = docreturn.blob.target;
  }
  
    function PageLatency() {
    }

    // Implement Pageforest Application inferface
    PageLatency.methods({


    });

    function main() {

        app = new PageLatency();
        client = new clientLib.Client(app);
        storage = client.storage;
       google.setOnLoadCallback(drawChart);
    }

  
    //google.load("visualization", "1", {packages:["corechart"]});
    //google.setOnLoadCallback(drawChart);
  
      function drawChart() {
        var data = new google.visualization.DataTable();
        data.addColumn('number', 'Time');
        data.addColumn('number', 'Latency (ms)');
        data.addRows(latencyTimes.length);
        for(var i = 0; i < latencyTimes.length; i++) {
          data.setValue(i, 0, latencyTimes[i].when-domainStart);
          data.setValue(i, 1, latencyTimes[i].ms);
        }
        


        var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
        chart.draw(data, {width: 500, height: 500,
                          title: 'Age vs. Weight comparison',
                          vAxis: {title: 'Latency', minValue: 0, maxValue: 100},
                          hAxis: {title: 'Time', minValue: 0, maxValue: latencyTimes[latencyTimes.length-1].ms},
                          legend: 'none'
                         });
      }
    

});
