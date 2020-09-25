let course_names = [];
let course_urls = [];
let username = "none";
let token = "";
let uid = 0;
let data = {};
let projectURL = "https://moowrap.firebaseio.com/";
let first_time = false;
chrome.runtime.onInstalled.addListener(async function() {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'hello.iitk.ac.in'},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });

	chrome.storage.sync.set({username: 'none'}, function() {
      console.log("No one there.");
    });

    username = await getCookie('username');
    token = await getCookie('token');
    uid = await getCookie('uid');
	await getData();
   	await getCourses();
	chrome.alarms.create('refresh', {periodInMinutes: 20});   
});

chrome.cookies.onChanged.addListener(function (cookieChanged) {
	console.log(cookieChanged.cookie);
	updateInfo();
});

chrome.alarms.onAlarm.addListener(
	(alarm) => {
	console.log(alarm.name);
});

async function updateInfo() {
	console.log("For now, do nothing.");
	for (const course_name of course_names) {
		let course_data = await getCourseInfo(course_name);
		data[course_name] = course_data;
	}
	console.log(data);
	await saveData();
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
		// console.log(course_names);
		// console.log(course_urls);
	});
	await updateInfo();
}

async function getCourseInfo(course_name){
	let course_data = {};
	if ((uid === undefined ) || (uid === 0) || (token === "" )){
		return;
	}
	PreURL = "https://hello.iitk.ac.in/api/";
	// https://hello.iitk.ac.in/api/ta201t/lectures/summary
	//Lectures:
	URL = PreURL + course_name + '/lectures/summary';
	await fetch(URL , {
		headers: {
			token: token,
			uid: uid
		}
	}).then(r => r.text()).then( res => {
		let lec_sum = {};
		try {
			lec_sum = JSON.parse(res);
			course_data['lec'] = lec_sum.length;
		}
		catch(e) {
			course_data['lec'] = 0;

		}
	});
	URL = PreURL + course_name + '/quiz/summary';
	await fetch(URL , {
		headers: {
			token: token,
			uid: uid
		}
	}).then(r => r.text()).then( res => {
		let quiz_sum = {};
		try {
			quiz_sum = JSON.parse(res);
			course_data['quiz'] = quiz.length;
		}
		catch(e) {
			course_data['quiz'] = 0;

		}
		// console.log(JSON.parse(res));
	});
	URL = PreURL + course_name + '/assignment/summary';
	await fetch(URL , {
		headers: {
			token: token,
			uid: uid
		}
	}).then(r => r.text()).then( res => {
		let asgn_sum = {};
		try {
			asgn_sum = JSON.parse(res);
			course_data['asgn'] = asgn_sum.length;
		}
		catch(e) {
			course_data['asgn'] = 0;

		}
	});
	return course_data;
}


async function getCookie(cookiename) {
	return new Promise((resolve, reject) => {
		chrome.cookies.get({"url": "https://hello.iitk.ac.in", "name": cookiename}, function(cookie) {
   		if (cookie){
   			// console.log(cookie.value);
   			resolve(cookie.value);
   		}
   		else {
   			reject(0);
   			console.log("Cookie not found.");
   			
   		}
    	
    	})
	});

}

async function saveData(){
	// await send request to firebase database PUT request.
	await fetch(projectURL + username + ".json", {
		method: 'PUT',
		body: JSON.stringify(data),
		headers: {
			'Content-type': 'application/json; charset=UTF-8'
				}
	}).then( r => r.json()).then( res => {
		console.log(res);
	});
}

async function getData(){
	// await fetch request to firebase database GET request.
	URL = projectURL + username + '.json';
	console.log(URL);
	await fetch(URL).then(r => r.json()).then(res => {
		console.log(res);
		if(res === null ){
			first_time = true;
		}
	})
}