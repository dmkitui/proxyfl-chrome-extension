let magneticLink;
let fileSize;

const addDownloadBtn = () => {
    const loadingAnimation = document.createElement("IMG"); //
    loadingAnimation.alt = "Loading...be patient";
    loadingAnimation.setAttribute('class', 'loading');
    loadingAnimation.src = chrome.runtime.getURL("static/bar.gif");

    let target = $('div#detailsframe, ul.tabNavigation')[0];

    console.log('TARGET ACQUIRED: ', target)

    $(target).before('<div class="container-div"></div>').slideDown(10000);
    $('.container-div').append('<button class="addButton" >Evaluating Home Router Status</button>').hide().fadeIn(1000);

    $('.addButton').on('click', () => {
        $('.addButton').replaceWith(loadingAnimation);
        apiScript(magneticLink)
    });
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
    	if (url === undefined || apiKey === undefined) {
    	    if (confirm('API KEY or URL is not provided. Set Now?')) {
    	        setupCredentials()
               }
    	    return
           }
    	$.ajax({
    		url: url,
    		headers: {
    			'Content-Type': 'application/json',
    			'X-Api-Key': apiKey,
    			'action': 'free_space'
    		},
    		type: 'get',
    	}).done(function (data) {
    	    if (typeof data === "string") {
                   chrome.storage.sync.remove(['url', 'apiKey']);
                   $('.addButton').replaceWith('<span class="error">Incorrect API Key or Server URL</span>');
                   return false
               }
    		const free_space = formatData(data.free_space);
            let spaceAvailability = freeSpaceEvaluator(free_space);

            if (spaceAvailability === 'no-space') {
                $('.addButton').text('No Space Available').prop('disabled', true)
            } else {
                $('.addButton').text('Add To Download List')
            }
    		$('.addButton').addClass(spaceAvailability).after(`<p class="free-space-text">Free space on router: <span class="gb-text">${free_space}</span></p>`).hide().fadeIn(1000);

    		$('.gb-text').after(`<a class='file_man_link' href='https://home.nairobibit.co.ke/files/' target='_blank'>Manage remote files</a>`).hide().fadeIn(1000)
    	}).fail(error => {
    	    console.log('ERROR: ', error)
            $('.addButton').replaceWith(`<span class="error">Error accessing server: ${url}. Kindly confirm the server is online.</span>`);
            alert(`Error accessing server: ${url}. Kindly confirm the server is online.`)
    	})
    };
	chrome.storage.sync.get(null, get_free_space);
    setTimeout(addDownloadBtn, 1)
};

const setupCredentials = () => {
    chrome.runtime.sendMessage({msg: 'setup_creds'}, function(response) {
        if(chrome.runtime.lastError) {
            setTimeout(setupCredentials, 1000);
        } else {
            console.log('Credentials updated.');
        }

    });
};

const freeSpaceEvaluator = (freeSpace) => {
    const availableSpace = sizeToBytes(freeSpace);
    const fileSizeBytes = sizeToBytes(fileSize);

    if ((availableSpace - fileSizeBytes)/1024*1024*1024 < 0.5) {
        return 'no-space'
    } else {
        return 'space-available'
    }
};

const sizeToBytes = (sizeString) => {
    let  [size, units] = sizeString.split(' ');
    if (units === "KB") {
        return size * 1024
    } else if (units === 'MB') {
        return size * 1024 * 1024
    } else if (units === "GB") {
        return size * 1024 * 1024 * 1024
    }
};

document.addEventListener("DOMContentLoaded", function() {
    chrome.storage.sync.get(null, display_free_space);

    if (window.location.hostname === 'katcr.to') {
        const fileMetaData = $('.sharingWidgetBox');
        magneticLink = $(fileMetaData).find('a.siteButton.giantButton')[0].href;
        let fileSizeDiv = $(fileMetaData).find('.widgetSize').find('strong')[0];
        fileSize = $(fileSizeDiv).text();
    } else if (window.location.hostname === 'tpb.party') {
        fileSize = $('dl.col1').find('dd')[2].textContent;
        magneticLink = $("a[title='Get this torrent']")[0].href
    }

});

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.msg === 'credsLoaded') {
        window.location.reload(true);
        sendResponse({state: 'Completed'})
    }
});