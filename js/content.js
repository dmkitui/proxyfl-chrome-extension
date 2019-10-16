const addDownloadBtn = () => {
	sendRandMsg('What now...')
  let magneticLink;
  const link =  $(".download")[0];
  magneticLink = $(link).find('a')[0].href;
  
  const loadingAnimation = document.createElement("IMG"); //
  loadingAnimation.alt = "Loading...be patient";
  loadingAnimation.setAttribute('class', 'loading');
  loadingAnimation.src = chrome.runtime.getURL("static/bar.gif");
  
  $('#detailsframe').before('<div class="container-div"></div>').slideDown(10000);
  $('.container-div').append('<button class="addButton" >Add To Download List</button>').hide().fadeIn(1000);
  $('.addButton').on('click', () => {
    $('.addButton').replaceWith(loadingAnimation);
    apiScript(magneticLink)
	  setTimeout(serverConnect, 100)
  });
  return true
};

const formatData = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const display_free_space = () => {
	const get_free_space = (credentials) => {
		const {url, apiKey} = credentials;
		$.ajax({
			url: url,
			headers: {
				'Content-Type': 'application/json',
				'X-Api-Key': apiKey,
				'action': 'free_space'
			},
			type: "get",
		}).done(function (data) {
			const free_space = formatData(data.free_space[2]);
			const freeSpaceText = `<p class="free-space-text">Free space on router: <span class="gb-text">${free_space}</span></p>`;
			$('.addButton').after(freeSpaceText).hide().fadeIn(1000);
			const file_man_link = `<a class='file_man_link' href='https://torrents-api.herokuapp.com/files/' target='_blank'>Manage remote files</a>`
			$('.gb-text').after(file_man_link).hide().fadeIn(1000)
		}).fail(error => {
			console.log('ERROR: ', error)
		})
	};
	chrome.storage.sync.get(null, get_free_space);
};

document.addEventListener("DOMContentLoaded", function() {
//	chrome.storage.sync.set({'url': "http://127.0.0.1:5000/torrent/"}, function() {console.log('Saved');});
//	chrome.storage.sync.set({'apiKey': "emdl%4E60PLWzVpuZomzxQej1U0pMIBYZ10n2DEg@j8uP^Ikp7h#0m1qWLU#K0S"}, function() {console.log('Saved');});
//	chrome.storage.sync.set({'files_url': "http://127.0.0.1:5000/files/"}, function() {console.log('Saved');});
  chrome.storage.sync.get(null, display_free_space);
  setTimeout(addDownloadBtn, 100)
});
