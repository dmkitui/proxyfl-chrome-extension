const apiScript = (magnet) => {
	const apiCall = async (data) => {
		const {url, apiKey} = data;
		$.ajax({
			url: url,
			headers: {
				'Content-Type': 'application/json',
				'X-Api-Key': apiKey,
				'magnet': magnet,
			},
			type: "post",
		}).done((res) => {
			if (res.message === 'Success!') {
		    $('.container-div').addClass('success');
		    $('.container-div').text(`Torrent lined up for downloading.`);
			}
		}).fail(error => {
			$('.container-div').addClass('error');
			if (error.status === 409) {
				$('.container-div').text('That torrent has already been downloaded. Get around to watching the stuff' +
				  ' sometime.');
			} else {
				$('.container-div').text(`Error ${error.status}: ${error.statusText}`);
			}
		});
	};
	chrome.storage.sync.get(null, apiCall);
};