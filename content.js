const addDownloadBtn = () => {
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
  });
  return true
};

const display_free_space = () => {
	const get_free_space = (credentials) => {
		const {token, url, password} = credentials;
		$.ajax({
			url: url,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'token': token,
				'password': password,
				'action': 'free_space'
			},
			type: "get",
		}).done(function (data) {
			const free_space = data.free_space;
			const text = `Free space on router: <span class="gb-text">${free_space} GB</span>`;
			const node = `<p class="free-space-text">${text}</p>`;
			$('.addButton').after(node).hide().fadeIn(1000);
			if(free_space < 5) {
				$('.gb-text').text(`${free_space} GB only!`);
				$('.gb-text').addClass('low-space')
			}
		});
	};
	chrome.storage.sync.get(null, get_free_space);
};

document.addEventListener("DOMContentLoaded", function() {
  chrome.storage.sync.get(null, display_free_space);
  setTimeout(addDownloadBtn, 1500)
});