/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

$.support.cors=true;
LOG_PREPEND = "SurpriseMe!!";

server_ip="http://139.59.9.19:8000/api/";
login="login";
showSurprise="showSurprise";
completeSurprise="completeSurprise";
skipSurprise="skipSurprise";
activity="wall";

username="";
credits=0;
skip_credits=0;
challenge_id=0;
challenge="";

// For PC browser only
$('body').onload=onLoad();

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        onLoad();
    }
};

function onLoad() {
	console.log(LOG_PREPEND + "onLoad()");
	$(".button-collapse").sideNav();
	showPage("login");
}

function showPage(page) {
	console.log("fun running");
	if (page === "login") {
		console.log(LOG_PREPEND + "Showing login page");
		$("#login").show();
		$("#challenge").hide();
		$("#wall").hide();

	} else if (page === "challenge") {
		console.log(LOG_PREPEND + "Showing challenge page");
		$("#login").hide();
		$("#challenge").show();
		$("#wall").hide();

	} else if (page === "wall") {
		console.log(LOG_PREPEND + "Showing activity wall page");
		$("#login").hide();
		$("#challenge").hide();
		$("#wall").show();

	} else {
		console.log (LOG_PREPEND + "Invalid Page Called: " + page);
	}
}

function sendLogin() {
	var obj = new Object();
	obj.user = $("#userid").val();
	username = obj.user;
	obj.password = $("#password").val();

	var str = JSON.stringify(obj);
	console.log(LOG_PREPEND + str);

	$.ajax({
		url: server_ip+login,
		type: "POST",
		dataType: "xml/html/script/json", // expected format for response
		contentType: "application/json", // send as JSON
		data: str,

		success: function(data) {
			alert("bhai pass ho gaya");
		},
		
		complete: function(data) {
			//called when complete
			//var obj = JSON.parse(data);
			console.log(data);
			alert(data.status);
			if(data.status == 200 && data.readyState == 4)
			{
				var obj = JSON.parse(data.responseText);
				console.log(data);
				console.log("asassas");
				if (!obj.verified) {
					console.log(LOG_PREPEND + "Not verified");
					alert(LOG_PREPEND + "User Not Verified");
				}
				//username = obj.name;
				credits = obj.credits;
				showPage("challenge");
				$("#navbar").show();
			}
			else
			{
				alert("Something went wrong, please try again.");
				console.log("Unable to contact server, try again");
			}
		}
	});
}

function showSurprise() {
	var obj = new Object();
	obj.user = username;

	var str = JSON.stringify(obj);
	console.log(LOG_PREPEND + str);
	$.post(server_ip+showSurprise, str, function(data, status) {
		console.log(LOG_PREPEND + data);

		var obj = JSON.parse(data);
		challenge_id = obj.id;
		challenge = obj.challenge;
		credits = obj.credits;
		skip_credits = obj.skip_credits;

		$("#surpriseme").hide();
		$("#skipsurprisebutton").show();
		$("#skipcost").text(skip_credits);
		$("#surprisetext").text(challenge);
	});
}

function skipSurprise() {
	var obj = new Object();
	obj.user = username;
	obj.id = challege_id;

	var str = JSON.stringify(obj);
	console.log(LOG_PREPEND + str);
	$.post(server_ip+skipSurprise, str, function(data, status) {
		console.log(LOG_PREPEND + data);

		var obj = JSON.parse(data);
		challenge_id = obj.id;
		challenge = obj.challenge;
		credits = obj.credits;
		skip_credits = obj.skip_credits;
	});
}

function completeSurprise() {
	var obj = new Object();
	obj.user = username;

	var str = JSON.stringify(obj);
	console.log(LOG_PREPEND + str);
	$.post(server_ip+completeSurprise, str, function(data, status) {
		console.log(LOG_PREPEND + data);

		var obj = JSON.parse(data);
		challenge_id = obj.id;
		challenge = obj.challenge;
		credits = obj.credits;
		skip_credits = obj.skip_credits;
	});
}
