let course_names = [];
let course_urls = [];
chrome.runtime.onInstalled.addListener(function() {
	getCourses();
	chrome.alarms.create('refresh', {periodInMinutes: 2});
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
chrome.alarms.onAlarm.addListener(
	(alarm) => {
	console.log(alarm.name);
	updateInfo();
});

function updateInfo() {
	console.log("For now, do nothing.");
}

async function getCourses() {
	await fetch('https://hello.iitk.ac.in/courses').then( r => r.text()).then(
	res => {
		var el = document.createElement('html');
		el.innerHTML = res;
		URLs  = (el.getElementsByTagName('a'));
		for (const item of URLs) {
			if(item.href.includes('course/')) {
				const course_url = item.href;
				course_urls.push(course_url);
				course_names.push(course_url.substring(32));
			}
		}
		console.log(course_names);
		console.log(course_urls);
	});
}
