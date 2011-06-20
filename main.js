// Scratch - a sample Pageforest Application
namespace.lookup('com.pageforest.pagelatency').defineOnce(function (exports) {
    var require = namespace.lookup;
    var clientLib = require('com.pageforest.client');

    exports['main'] = main;
  exports['loaded'] = loaded;
  exports['go'] = go;
  exports['save'] = save;
  exports['addTarget'] = addTarget;
  
  
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
  
  
  
  var activeTargets = [];
  
  function addTarget() {
    activeTargets.push(document.getElementById("targetUrl").value);
    drawTargets();
  }
  
  function drawTargets() {
    document.getElementById("testcontainer").innerHTML = "";
    for(var i = 0; i < activeTargets.length; i++) {
      document.getElementById("testcontainer").innerHTML += activeTargets[i];
    }
  }
  
  function loaded() {
    loadcount++;
    var lasttime = new Date().getTime() - starttime;
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
    document.getElementById("myframe").src = targUrl;
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
    }

  

});
