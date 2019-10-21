
window.onload = function() {
    console.log('Window openned.....')
    $('#updateBtn').on('click', function(evt){
        const url = $('.url').val();
        const apiKey = $('.apiKey').val();
        chrome.runtime.sendMessage({ msg: 'updateCreds', creds: {url: url, apiKey: apiKey}}, function (response) {
            if (response.state === 'completed') {
                window.close();
            }
        });
    });
};
