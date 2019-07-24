var mainSVG, svgDoc, hourHand, minHand, secHand, mainbackground, 
background, background2, centersec, mechanicals, gradientstops, gradientstopsbg, datetext, cameraButton, cameraButtonbg, datebg,
popupgroup,popupmainbg,popupbuttonbg,popupmaintext,popupmaintext2, countdowntext,popupokbuttonart, bgdesign;

var SASocket = null;
var SAAgent = null;
var ProviderAppName = "FitMyStyle";
var SAPServiceChannelId = 110;
var popupTimerId, mainTimerId, screenOnTimerId;
var mechanicsTimerId = -1;
mainSVG = document.getElementById("mainsvg");
var foregroundColor = "#FFFFFF";
var backgroundColor = "#272727";
var textColor = "#333333";
//mainSVG.addEventListener('load', function() {
function svgOnLoad(){
	//	alert("Inside on load");
	svgDoc = mainSVG.contentDocument;
	hourHand = svgDoc.getElementById("hour");
	minHand = svgDoc.getElementById("minute");
	secHand = svgDoc.getElementById("second");
	//colorpickergroup = svgDoc.getElementById("colorpickergroup");
	mainbackground = svgDoc.getElementById("backgroundgroup");
	background = svgDoc.getElementById("foreground");
	background2 = svgDoc.getElementById("background");
	centersec = svgDoc.getElementById("centersec");
	//textSamsung = svgDoc.getElementById("maintext");
	//textSamsungShine = svgDoc.getElementById("maintextshine");
	//textsubtext = svgDoc.getElementById("subtext");
	datetext = svgDoc.getElementById("datetext");
	datebg = svgDoc.getElementById("datebg");
	mechanicals = [ svgDoc.getElementById("mechanical1"),
			svgDoc.getElementById("mechanical2"),
			svgDoc.getElementById("mechanical3"),
			svgDoc.getElementById("mechanical4"),
			svgDoc.getElementById("mechanical5") ];
	cameraButton = svgDoc.getElementById("cameraButton");
	cameraButtonbg = svgDoc.getElementById("cameraButtonbg");
	
	//selfie popup components:
	popupgroup = svgDoc.getElementById("popupgroup");
	popupmainbg = svgDoc.getElementById("popupmainbg");
	popupbuttonbg = svgDoc.getElementById("popupbuttonbg");
	popupmaintext = svgDoc.getElementById("popupmaintext");
	popupmaintext2 = svgDoc.getElementById("popupmaintext2");
	countdowntext = svgDoc.getElementById("countdowntext");
	popupokbuttonart = svgDoc.getElementById("popupokbuttonart");
	
	bgdesign = svgDoc.getElementById("bgdesign");
	
	
	if (hourHand === null) {
		alert("Graphics not loaded properly. Please try again.");
	} else {
		popupgroup.setAttribute("display", "none");
		var okbutton = svgDoc.getElementById("okbutton");
		okbutton.onmouseup = function() {
			clearInterval(popupTimerId);
			if(sendColorChangeRequest()) {
				popupmaintext.textContent = "Success!";
				popupmaintext2.textContent = "Check your phone!";
			} else {
				popupmaintext.textContent = "Error!";
				popupmaintext2.textContent = "Could not connect to M.G.M.S.";
			}
			countdowntext.textContent = "";
			var tempTimerId = setInterval(function () {
				
		       	clearInterval(tempTimerId);
		       	popupgroup.setAttribute("display", "none");
				
		    }, 1500);
		};
		if(localStorage["isSelfieButtonEnabled"]!=null) {
			if(localStorage["isSelfieButtonEnabled"] == "true") {
				cameraButton.setAttributeNS(null, 'visibility', 'visible');
			} else {
				cameraButton.setAttributeNS(null, 'visibility', 'hidden');
			}
		} else {
			cameraButton.setAttributeNS(null, 'visibility', 'hidden');
		}
		cameraButton.onmouseup = function() {
			sendSelfieRequest();
		};
		//don't allow click events on images which cover whole screen !
		hourHand.setAttribute("pointer-events", "none");
		minHand.setAttribute("pointer-events", "none");
		secHand.setAttribute("pointer-events", "none");
		gradientstops = [ svgDoc.getElementById("gradientstop1"),
				svgDoc.getElementById("gradientstop2"),
				svgDoc.getElementById("gradientstop3"),
				svgDoc.getElementById("gradientstop4"),
				svgDoc.getElementById("gradientstop5") ];
		gradientstopsbg = [ svgDoc.getElementById("gradientstopbg1"),
				svgDoc.getElementById("gradientstopbg2") ];
		// Start main loop
		mainTimerId = setInterval(function() {
			drawWatch();
		}, 1000);
		if(localStorage["watchBackground"] == 1) {
			setFeminineStyle(true);
			bgdesign.setAttribute("display", "none");
		} else if(localStorage["watchBackground"] == 2) {
			bgdesign.setAttribute("display", "inline");
			bgdesign.setAttributeNS('http://www.w3.org/1999/xlink','href',localStorage["imagePattern"]);
			
		} else {
			setFeminineStyle(false);
			bgdesign.setAttribute("display", "none");
		}
		// add eventListener to update the screen immediately when the device wakes up
		document.addEventListener("visibilitychange", function() {
			if (!document.hidden) {
				drawWatch();
			}
		});
		if (localStorage["primaryColor"] != null
				&& localStorage["secondaryColor"] != null
				&& localStorage["textColor"] != null) {
			foregroundColor = localStorage["primaryColor"];
			backgroundColor = localStorage["secondaryColor"];
			textColor = localStorage["textColor"];
			
		}
		setwatchbackgroundcolor();
		//alert("6");
	}
}

try {
	webapis.sa.requestSAAgent(onsuccess, function(err) {
		//    	alert("err [" + err.name + "] msg[" + err.message + "]");
		console.log("err [" + err.name + "] msg[" + err.message + "]");
	});
} catch (err) {
	//	alert("exception [" + err.name + "] msg[" + err.message + "]");
	console.log("exception [" + err.name + "] msg[" + err.message + "]");
}

/*add this for background and foreground elements:
 * <linearGradient id="background_1_" gradientUnits="userSpaceOnUse" x1="9.8815" y1="123.6417" x2="345.4023" y2="234.7959">
 <stop id="gradientstopbg1"  offset="0" style="stop-color:#121212"/>
 <stop id="gradientstopbg2" offset="1" style="stop-color:#020202"/>
 </linearGradient>
 <circle id="background" fill="url(#background_1_)" stroke="#3C3C3B" stroke-miterlimit="10" cx="180" cy="180" r="180"/>

 <radialGradient id="foreground_1_" cx="179.5" cy="179.5" r="179.8951" gradientUnits="userSpaceOnUse">
 <stop id="gradientstop1" offset="0" style="stop-color:#AB6CAA"/>
 <stop id="gradientstop2" offset="0.2" style="stop-color:#79477A"/>
 <stop id="gradientstop3" offset="0.6" style="stop-color:#43254B"/>
 <stop id="gradientstop4" offset="0.92" style="stop-color:#2D1837"/>
 <stop id="gradientstop5" offset="1" style="stop-color:#391F50"/>
 </radialGradient>

 */

function drawWatch() {
	var datetime = new Date(), datetimehour = datetime
			.getHours(), datetimeminute = datetime.getMinutes(), datetimesecond = datetime
			.getSeconds(), datetimedate = datetime.getDate();
	if (parseInt(datetimedate, 10) < 10)
		datetimedate = "0" + datetimedate;
	datetext.textContent = datetimedate;
	// Draw a watch content

	drawWatchContent(datetimehour, datetimeminute, datetimesecond, datetimedate);
}

function setFeminineStyle(isTrue) {
	feminineDesign = isTrue;
	var treeartwork = svgDoc.getElementById("treeartwork");
	var mechanicalgroup = svgDoc.getElementById("mechanicalgroup");
	if(feminineDesign === true) {
		if(mechanicsTimerId!=-1)
			clearInterval(mechanicsTimerId);
		treeartwork.setAttribute("display", "inline");
		mechanicalgroup.setAttribute("display", "none");
		
		treeartwork.setAttribute("fill", lighterColor(backgroundColor, 0.4));
	}
	else{
		treeartwork.setAttribute("display", "none");
		mechanicalgroup.setAttribute("display", "inline");
		mechanicsTimerId = setInterval(function() {
			drawMachanics(mechanicals);
		}, 200);
	}
}
function setwatchbackgroundcolor() {
	//console.log(customiseButton+","+ gradientstops+","+ background+","+ centersec+","+fill);
	//background.setAttribute("fill", fill);
	//	for (var int = 0; int < gradientstops.length; int++) {
	//		var gradientstop = gradientstops[int];
	//		gradientstop.setAttribute("style","stop-color:"+lighterColor(fill, .2*int));
	//	}
	if (gradientstops[0] == null)
		return;
	gradientstops[0].setAttribute("style", "stop-color:"
			+ darkerColor(foregroundColor, .1));
	gradientstops[1].setAttribute("style", "stop-color:"
			+ lighterColor(foregroundColor, 0));
	gradientstops[2].setAttribute("style", "stop-color:"
			+ darkerColor(foregroundColor, 0.1));
	gradientstops[3].setAttribute("style", "stop-color:"
			+ darkerColor(foregroundColor, .3));
	gradientstops[4].setAttribute("style", "stop-color:"
			+ darkerColor(foregroundColor, 0));

	gradientstopsbg[0].setAttribute("style", "stop-color:"
			+ darkerColor(backgroundColor, 0));
	gradientstopsbg[1].setAttribute("style", "stop-color:"
			+ darkerColor(backgroundColor, 0.2));

	centersec.setAttribute("fill", darkerColor(foregroundColor, 0.3));
	cameraButtonbg.setAttribute("fill", darkerColor(foregroundColor, 0.5));
	datebg.setAttribute("fill", darkerColor(foregroundColor, 0.5));
	
	popupmainbg.setAttribute("fill", darkerColor(backgroundColor, 0.3));
	popupmaintext.setAttribute("fill", lighterColor(backgroundColor, 0.3));
	popupmaintext2.setAttribute("fill", lighterColor(backgroundColor, 0.3));
	
	popupbuttonbg.setAttribute("fill", darkerColor(foregroundColor, 0.3));
	countdowntext.setAttribute("fill", lighterColor(foregroundColor, 0.3));
	popupokbuttonart.setAttribute("fill", lighterColor(foregroundColor, 0.3));
	
}

function setSelfieButton() {
	if(localStorage["isSelfieButtonEnabled"]!=null) {
		if(localStorage["isSelfieButtonEnabled"] == "true") {
			cameraButton.setAttributeNS(null, 'visibility', 'visible');
		}
		else {
			cameraButton.setAttributeNS(null, 'visibility', 'hidden');
		}
	}
}

var pad = function(num, totalChars) {
	var pad = '0';
	num = num + '';
	while (num.length < totalChars) {
		num = pad + num;
	}
	return num;
};

// Ratio is between 0 and 1
var changeColor = function(color, ratio, darker) {
	// Trim trailing/leading whitespace
	color = color.replace(/^\s*|\s*$/, '');

	// Expand three-digit hex
	color = color.replace(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i,
			'#$1$1$2$2$3$3');

	// Calculate ratio
	var difference = Math.round(ratio * 256) * (darker ? -1 : 1),
	// Determine if input is RGB(A)
	rgb = color.match(new RegExp('^rgba?\\(\\s*'
			+ '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' + '\\s*,\\s*'
			+ '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' + '\\s*,\\s*'
			+ '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' + '(?:\\s*,\\s*'
			+ '(0|1|0?\\.\\d+))?' + '\\s*\\)$', 'i')), alpha = !!rgb
			&& rgb[4] != null ? rgb[4] : null,

	// Convert hex to decimal
	decimal = !!rgb ? [ rgb[1], rgb[2], rgb[3] ] : color.replace(
			/^#?([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])/i,
			function() {
				return parseInt(arguments[1], 16) + ','
						+ parseInt(arguments[2], 16) + ','
						+ parseInt(arguments[3], 16);
			}).split(/,/), returnValue;

	// Return RGB(A)
	return !!rgb ? 'rgb'
			+ (alpha !== null ? 'a' : '')
			+ '('
			+ Math[darker ? 'max' : 'min'](parseInt(decimal[0], 10)
					+ difference, darker ? 0 : 255)
			+ ', '
			+ Math[darker ? 'max' : 'min'](parseInt(decimal[1], 10)
					+ difference, darker ? 0 : 255)
			+ ', '
			+ Math[darker ? 'max' : 'min'](parseInt(decimal[2], 10)
					+ difference, darker ? 0 : 255)
			+ (alpha !== null ? ', ' + alpha : '') + ')' :
	// Return hex
	[
			'#',
			pad(Math[darker ? 'max' : 'min'](
					parseInt(decimal[0], 10) + difference, darker ? 0 : 255)
					.toString(16), 2),
			pad(Math[darker ? 'max' : 'min'](
					parseInt(decimal[1], 10) + difference, darker ? 0 : 255)
					.toString(16), 2),
			pad(Math[darker ? 'max' : 'min'](
					parseInt(decimal[2], 10) + difference, darker ? 0 : 255)
					.toString(16), 2) ].join('');
};
var lighterColor = function(color, ratio) {
	return changeColor(color, ratio, false);
};
var darkerColor = function(color, ratio) {
	return changeColor(color, ratio, true);
};

function drawWatchContent(datetimehour, datetimeminute, datetimesecond,
		datetimedate) {
	//	alert("Inside drawWatchContent")
	// ---------------------------------second hand-------------------------
	var angle = datetimesecond * 6;

	//console.log("angle:"+angle);
	var radian = angle * Math.PI / 180;
	var translateradian = (45 + angle) * Math.PI / 180;
	var xTranslate = 180 - Math.sqrt(2) * 180 * Math.cos(translateradian);
	var yTranslate = -1
			* (Math.sqrt(2) * 180 * Math.sin(translateradian) - 180);
	var matrix = "matrix(" + Math.cos(radian) + " " + Math.sin(radian) + " "
			+ (-1 * Math.sin(radian)) + " " + Math.cos(radian) + " "
			+ xTranslate + " " + yTranslate + ")";
	secHand.setAttribute("transform", matrix);
	// ---------------------------------second hand end-------------------------

	// ---------------------------------minute hand-------------------------
	var angle = datetimeminute * 6;
	//console.log("angle:"+angle);
	var radian = angle * Math.PI / 180;
	var translateradian = (45 + angle) * Math.PI / 180;
	var xTranslate = 180 - Math.sqrt(2) * 180 * Math.cos(translateradian);
	var yTranslate = -1
			* (Math.sqrt(2) * 180 * Math.sin(translateradian) - 180);
	var matrix = "matrix(" + Math.cos(radian) + " " + Math.sin(radian) + " "
			+ (-1 * Math.sin(radian)) + " " + Math.cos(radian) + " "
			+ xTranslate + " " + yTranslate + ")";
	minHand.setAttribute("transform", matrix);
	// ---------------------------------minute hand end-------------------------

	// ---------------------------------hour hand-------------------------
	var angle = 0.5 * (datetimeminute + datetimehour * 60);
	//console.log("angle:"+angle);
	var radian = angle * Math.PI / 180;
	var translateradian = (45 + angle) * Math.PI / 180;
	var xTranslate = 180 - Math.sqrt(2) * 180 * Math.cos(translateradian);
	var yTranslate = -1
			* (Math.sqrt(2) * 180 * Math.sin(translateradian) - 180);
	var matrix = "matrix(" + Math.cos(radian) + " " + Math.sin(radian) + " "
			+ (-1 * Math.sin(radian)) + " " + Math.cos(radian) + " "
			+ xTranslate + " " + yTranslate + ")";
	hourHand.setAttribute("transform", matrix);
	// ---------------------------------hour hand end-------------------------
	//rotate(Xdeg) = matrix(cos(X), sin(X), -sin(X), cos(X), 0, 0); rotate 90deg = (0 -1 1 0 0 360)
	//degrees == radians * 180/π

}

function drawMachanics(mechanicals) {
	//	alert("Inside drawMachanics");
	if (mechanicals === null){
		return;
	}
	// var datetime = tizen.time.getCurrentDateTime(), milsecond = datetime
	// 		.getMilliseconds(), second = datetime.getSeconds();
	var datetime = new Date();
	var milsecond = datetime.getMilliseconds();
	var second = datetime.getSeconds();
	milsecond = second + (milsecond / 1000);
	//----------------------mechanics start--------------------------------
	var mecahnicsXs = [ 69.3, 308.5, 257.5, 115, 185.6 ];
	var mecahnicsYs = [ 240.6, 199.5, 280.3, 308, 279.6 ];
	var angles = [ second * 6, milsecond * 12, -milsecond * 12, -second * 6,
			second * 6 ];
	//console.log(second + ":" + milsecond);
	// console.log(angles)
	for (var int = 0; int < mechanicals.length; int++) {
        // console.log(int);
		var mechradian = angles[int] * Math.PI / 180;
		// console.log("mechradian: " + mechradian);
		var mechtranslateradian = (45 + angles[int]) * Math.PI / 180;
		var halfwidth = mechanicals[int].getAttribute("width") / 2;
		var xTranslategear = halfwidth - Math.sqrt(2) * halfwidth
				* Math.cos(mechtranslateradian) + mecahnicsXs[int] - halfwidth;
		var yTranslategear = -1
				* (Math.sqrt(2) * halfwidth * Math.sin(mechtranslateradian) - halfwidth)
				+ mecahnicsYs[int] - halfwidth;
		var matrixgear = "matrix(" + Math.cos(mechradian) + " "
				+ Math.sin(mechradian) + " " + (-1 * Math.sin(mechradian))
				+ " " + Math.cos(mechradian) + " " + xTranslategear + " "
				+ yTranslategear + ")";
		// console.log(mechradian);
		// console.log(xTranslategear);
		// console.log(matrixgear);
		mechanicals[int].setAttribute("transform", matrixgear);
	}
	//------------------------------------------mechanics end--------------------------------
}

function onsuccess(agents) {
	try {
		if (agents.length > 0) {
			SAAgent = agents[0];
			SAAgent.setServiceConnectionListener(agentCallback);
			SAAgent.setPeerAgentFindListener(peerAgentFindCallback);
			SAAgent.findPeerAgents();
		} else {
			alert("Error connecting to phone!!");
		}
	} catch (err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

var agentCallback = {

	onrequest : function(peerAgent) {
		//			 alert("onrequest")
		if (peerAgent.appName == ProviderAppName) {
			try {
				SAAgent.acceptServiceConnectionRequest(peerAgent);
			} catch (e) {
				console.log("Error Exception, error name : " + e.name
						+ ", error message : " + e.message);
			}
		}
	},

	onconnect : function(socket) {
		//			alert("agentCallback onconnect");
		SASocket = socket;
		//Register Listener
		SASocket.setDataReceiveListener(onreceive);
		//			alert("SAP Connection established with RemotePeer");

		SASocket.setSocketStatusListener(function(reason) {
			//				alert("Service connection lost, Reason : [" + reason + "]");
		});
	},

	onerror : onerror
};

var peerAgentFindCallback = {
	onpeeragentfound : function(peerAgent) {
		try {
			if (peerAgent.appName == ProviderAppName) {
				console("Peer found");
				SAAgent.setServiceConnectionListener(agentCallback);
				SAAgent.requestServiceConnection(peerAgent);
			} else {
				console("Not expected app!! : " + peerAgent.appName);
			}
		} catch (err) {
			console
					.log("exception [" + err.name + "] msg[" + err.message
							+ "]");
		}
	},
	onerror : function() {
		console("Connection problem");
	}
}

function onreceive(channelId, data) {
	try {
		var obj = JSON.parse(data);
		if(obj.primaryColor!=null || obj.secondaryColor!=null) {
			
			console.log("onreceive data: " + data);

			console.log(obj.primaryColor);
			console.log(obj.primaryColorText);
			console.log(obj.primaryColorContrast);

			console.log(obj.secondaryColor);
			console.log(obj.secondaryColorText);
			console.log(obj.secondaryColorContrast);

			//var colors = data.split(",");
			foregroundColor = obj.primaryColor;
			backgroundColor = obj.secondaryColor;
			textColor = obj.primaryColorText;
			setwatchbackgroundcolor();
			localStorage["primaryColor"] = obj.primaryColor;//colors[0];
			localStorage["secondaryColor"] = obj.secondaryColor;//colors[1];
			localStorage["textColor"] = obj.primaryColorText;//colors[2];
			//        alert("Setting the colors got form the device");
		}
		

		if(obj.enableSelfieButton!=null) {
			localStorage["isSelfieButtonEnabled"] = obj.enableSelfieButton;
			setSelfieButton();
		}
		
		if(obj.watchBackground!=null) {
			localStorage["watchBackground"] = obj.watchBackground;
			if(localStorage["watchBackground"] == 1) {
				setFeminineStyle(true);
				bgdesign.setAttribute("display", "none");
			}
			else if(localStorage["watchBackground"] == 0) {
				setFeminineStyle(false);
				bgdesign.setAttribute("display", "none");
			} else if(localStorage["watchBackground"] == 2) {
				if(obj.imagePattern!=null) {
					localStorage["imagePattern"] = "data:image/png;base64," + obj.imagePattern;
				}
				bgdesign.setAttributeNS('http://www.w3.org/1999/xlink','href',localStorage["imagePattern"]);
				bgdesign.setAttribute("display", "inline");
				if(mechanicsTimerId!=-1)
					clearInterval(mechanicsTimerId);
			}
		}
		
		if(obj.displayOnTime!=null) {
			var screenOnTime = obj.displayOnTime;
			clearTimeout(screenOnTimerId);
			if(screenOnTime==0) {
				tizen.power.release("SCREEN");
			} else {
				tizen.power.request("SCREEN", "SCREEN_NORMAL");
				screenOnTimerId = setTimeout(function () {
					tizen.power.release("SCREEN");
				}, screenOnTime);
			}
		}
		
		if (tizen.power.isScreenOn() == false)
			tizen.power.turnScreenOn(); 
		setTimeout(function () {
			navigator.vibrate([100,100,50]);
		}, 300);
		

	} catch (error) {
		console.log("error occurred : onreceive");
		alert("Error connecting to phone!!");
		for ( var prop in error) {
			console.log(prop + ": " + error[prop]);
			alert("Error connecting to phone!!");
		}
	}
}

function sendColorChangeRequest() {
	try {
		if (SASocket == null) {
			console.log("sap initialize");
			connect();
			//alert("Sorry. Could not start phone camera. Please use app on phone.");
			return false;
		}
		SASocket.sendData(SAPServiceChannelId, "Change Color");
	} catch (err) {
		return false;
		//alert("Sorry. Could not start phone camera. Please use app on phone.");
	}
	return true;
}

function sendSelfieRequest() {
	try {
		if (SASocket == null) {
			console.log("sap initialize");
			connect();
			alert("Sorry. Could not start phone camera. Please use app on phone.");
			return false;
		}
		popupmaintext.textContent = "Take selfie from phone";
		popupmaintext2.textContent = "camera?";
		popupgroup.setAttribute("display", "inline");
		var countdown = 5;
		countdowntext.textContent = countdown;
		popupTimerId = setInterval(function () {
			countdowntext.textContent = --countdown;
	        if (countdown == 0) {
	        	popupgroup.setAttribute("display", "none");
	        	clearInterval(popupTimerId);
	        }
	    }, 1000);
	} catch (err) {
		alert("Sorry. Could not start phone camera. Please use app on phone.");
	}
}

function connect() {
	if (SASocket) {
		console('Already connected!');
		return false;
	}

	try {
		webapis.sa.requestSAAgent(onsuccess, function(err) {
			console.log("err [" + err.name + "] msg[" + err.message + "]");
		});
	} catch (err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
	alert("Restarting");
    //alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber + ' Column: ' + column + ' StackTrace: ' +  errorObj);
    console.log('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber + ' Column: ' + column + ' StackTrace: ' +  errorObj);
//    return true;
};
