function doStuffWithDom(domContent) {
	function getTorrentLink() {
		var result;
		var link =  $(".download")[0]
		console.log('Tab script:' + $(link).find('a')[0].href);
		result = $(link).find('a')[0].href;
		apiScript(result);
		return result
	}
	// We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
	chrome.tabs.executeScript({
	    code: '(' + getTorrentLink + ')();' //argument here is a string but function.toString() returns function's code
	}, function (results) {
    //Here we have just the innerHTML and not DOM structure
    console.log('ExeciuteScript: ', results)
	});
}

chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "report_back"}, doStuffWithDom);
  });
});