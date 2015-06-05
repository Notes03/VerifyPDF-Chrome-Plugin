var selectedId = -1;
function detectPdf(){
	setTimeout(function() {
		var countPDF = 0;

		chrome.tabs.sendMessage(selectedId, {action: "findHref"}, function(response) {}); 
		chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
			if (msg.action != undefined && msg.action >= 0) {
				chrome.browserAction.setBadgeBackgroundColor({color:"#3498db"});
				chrome.browserAction.setBadgeText({"text": ""+msg.action, tabId: selectedId});
			}
		});
		
	}, 1500);
	return true;
}

chrome.tabs.onUpdated.addListener(function(tabId, props) {
  if (props.status == "complete" && tabId == selectedId) {
    console.log("onUpdated");
	detectPdf();
  }
});

chrome.tabs.onSelectionChanged.addListener(function(tabId, props) {
  selectedId = tabId;
  console.log("onSelectionChanged");
  //detectPdf();
});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  selectedId = tabs[0].id;
  console.log("query");
  detectPdf();
});
