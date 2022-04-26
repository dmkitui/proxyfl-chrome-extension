const sendLink = (magnet) => {
    const apiCall = async (data) => {
        const {url, apiKey} = data;
        $.ajax({
            url: url,
            headers: {'Content-Type': 'application/json', 'X-Api-Key': apiKey, 'magnet': magnet,},
            type: "post",
        }).done((res) => {
            if (res.message === 'Success!') {
                console.log('Torrent added nicely...')
                $('.main-container').replaceWith('<div class="success-div">Torrent Added Successfully</div>')
                setTimeout(function () {
                    window.close();
                }, 10000)
            }
        }).fail(error => {
            console.log('Error detected....')
            $('.main-container').addClass('error-div');
            if (error.status === 409) {
                $('.main-container').text('That stuff is already listed/downloaded. Get around to watching the stuff sometime.');
            } else {
                $('.main-container').text(`Error ${error.status}: ${error.statusText}`);
            }
        });
    };
    chrome.storage.sync.get(null, apiCall);
};

const sendMsg = (link) => {
    chrome.runtime.sendMessage({msg: 'add_torrent', link: link}, function (response) {
        if (chrome.runtime.lastError) {
            setTimeout(sendMsg, 1000, link);
        } else {
            console.log(response);
        }
    });
};
const formatStuff = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

function free_space (credentials) {
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
   		type: "get",
   	}).done(function (data) {
        if (typeof data === "string") {
            chrome.storage.sync.remove(['url', 'apiKey']);
            $('.main-container').replaceWith('<span class="error">Incorrect API Key or Server URL</span>');
            return false
        }
        const free_space = formatStuff(data.free_space);
        $('.gb-text').text(free_space)

    }).fail(error => {
    	    console.log('ERROR: ', error)
    })
}


window.onload = function () {
    chrome.storage.sync.get(null, free_space);
    const linkInput = $('.magnetic-input');
    linkInput.focus();
    $('#addButton').on('click', function (evt) {
        const link = linkInput.val();

        const spinner = document.createElement('i');
        spinner.alt = 'Contacting server';
        spinner.setAttribute('class', 'fa fa-spinner fa-spin');
        spinner.setAttribute('style', 'font-size:48px;color:green;');
        $('.content-div').replaceWith(spinner);

        sendLink(link)
    });

    linkInput.on('paste drop', function () {
        setTimeout(function () {
            const link = $('.magnetic-input').val();
            if (link.match(/magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i) != null) {
                $('#addButton').prop('disabled', false);
                $('.magnetic-input').removeClass('hasError')
            } else {
                $('.magnetic-input').addClass('hasError')
            }
        }, 200)
    })
};