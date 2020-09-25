let courses = [];
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({username: 'none'}, function() {
      console.log("No one there.");
    });
    let username = "none";
   	chrome.cookies.get({"url": "https://hello.iitk.ac.in", "name": "username"}, function(cookie) {
   		if (cookie == null){
   			console.log("Cookie not found.");
   		}
   		else {
   			username = cookie.value;
    		chrome.storage.sync.set({username: username}, function() {
    			console.log("Saved Username.");
    		});
    		console.log()
   		}
    	
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'hello.iitk.ac.in'},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
});
chrome.cookies.onChanged.addListener(function (cookieChanged) {
	console.log(cookieChanged.cookie);
});
