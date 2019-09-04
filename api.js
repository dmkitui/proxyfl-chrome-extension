const apiScript = (magnet) => {
	const apiCall = async (data) => {
		
		const {token, url, password} = data;
		
		const xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.setRequestHeader("token", token);
		xhr.setRequestHeader("password", password);
		xhr.setRequestHeader("magnet", magnet);
		xhr.send();
		
		xhr.onload = function() {
		  if (xhr.status !== 201) {
		    $('.container-div').addClass('error');
		    if ( xhr.status === 409) {
		      $('.container-div').text('That torrent has already been downloaded. Get around to watching the stuff' +
					  ' sometime.');
			  } else {
		      $('.container-div').text(`Error ${xhr.status}: ${xhr.statusText}`);
			  }
		   
		  } else { // show the result
		    $('.container-div').addClass('success');
		    $('.container-div').text(`Torrent lined up for downloading.`);
		  }
		};
	};
	
	chrome.storage.sync.get(null, apiCall);
	
};
