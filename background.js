function showDownloadBtn(domContent) {
	function getTorrentLink() {
		let magneticLink;
		const link =  $(".download")[0];
		magneticLink = $(link).find('a')[0].href;
		
		const loadingAnimation = document.createElement("IMG"); //
		loadingAnimation.alt = "Loading...be patient";
		loadingAnimation.setAttribute('class', 'loading');
		loadingAnimation.src = chrome.runtime.getURL("static/bar.gif");
		
		$('#detailsframe').before('<div class="container-div"></div>');
		$('.container-div').append('<button class="addButton" >Add To Download List</button>');
		$('.addButton').on('click', () => {
			$('.addButton').replaceWith(loadingAnimation);
			apiScript(magneticLink)
		});
		return true
	}
	chrome.tabs.executeScript({
	    code: '(' + getTorrentLink + ')();'
	}, function (magneticLink) {
    console.log('ExeciuteScript: ', magneticLink);
	});
}

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "report_back"}, showDownloadBtn);
  });
});