

//const serverConnect = (data) => {
//		const socket = io.connect('http://localhost:8080/', {secure: true, rejectUnauthorized: false});
//	  socket.on('message', function(message) {
//	      alert('The server has a message for you: ' + message);
//	  })
//		socket.on('connection', function() {
//			console.log('Client connected');
//			const x = socket.emit('message', 'Hallo from the extension!!!!');
//			console.log('RES X: ', x, '    :', data)
//		});
//		console.log('Time out time...');
//		const x = socket.emit('message', 'Hallo from the extension!!!!');
//		console.log('RES X: ', x, '    :', data)
//};

let ws;
if ("WebSocket" in window) {
  ws = new WebSocket("ws://localhost:8080/", 'echo-protocol');
  ws.onopen = function() {
    ws.send("hello");
  };
}



const tryServerMessaging = (msg) => {
  const bgPage = chrome.extension.getBackgroundPage();
  bgPage.sendRandMsg('We here baby......')
}