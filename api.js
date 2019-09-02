function apiScript (data) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", 'https://torrents-api.herokuapp.com/torrent/', true);
	
	//Send the proper header information along with the request
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("token", "emdl%4E60PLWzVpuZomzxQej1U0pMIBYZ1$#n2DEg@j8uP^Ikp7h#0m1qWLU#K0S");
	xhr.setRequestHeader("password", "F^J)TUbHipAdQ2*iWznrovj1A3Gy$YYg");
	xhr.setRequestHeader("magnet", data);
	
	xhr.send()
	
	xhr.onload = function() {
	  if (xhr.status !== 201) { // analyze HTTP status of the response
	  	if ( xhr.status === 409) {
	  		alert('Error! That file has already been lined up for downloading.')
		  } else {
	  		alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
		  }
	   
	  } else { // show the result
	    alert(`Files lined up for downloading.`); // responseText is the server
	  }
	};
	
}