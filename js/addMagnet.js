console.log('What now, laoded ');

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

window.onload = function () {
    const linkInput = $('.magnetic-input')
    linkInput.focus()
    $('#addButton').on('click', function (evt) {
        console.log('Adding torrent in a few...')
        const link = linkInput.val();
        sendLink(link)
    });

    linkInput.on('paste drop', function () {
        console.log('Blurred event start...');
        setTimeout(function () {
            const link = $('.magnetic-input').val();
            console.log('Blurred event ', link);
            console.log('XXXX: ', link.match(/magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i));
            if (link.match(/magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i) != null) {
                console.log('Valid link')
                $('#addButton').prop('disabled', false);
                $('.magnetic-input').removeClass('hasError')
            } else {
                console.log('Invalid link...')
                $('.magnetic-input').addClass('hasError')
            }
        }, 200)
    })
};