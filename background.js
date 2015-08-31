chrome.app.runtime.onLaunched.addListener(function(launchData) {
  chrome.app.window.create('views/index.html', {
  	id: "host",
    bounds: {
      width: 800,
      height: 600,
      left: 100,
      top: 100
    },
    minWidth: 800,
    minHeight: 600,
    frame: 'none'
  });
  chrome.tabs.executeScript( launchData, {code:"var x = 10; x"}, function(results){ 
          console.log(results); 
  } );
});

