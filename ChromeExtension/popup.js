let msgElement = document.getElementById('msg');
chrome.storage.sync.get('username', function(data) {
	console.log(msgElement);
	if(data.username == "none") {
		msgElement.innerText = "Please Login!";
	}
	else {
  		msgElement.innerText = "Hi!, " + data.username ;
	}
});