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
LOG_PREPEND = "SurpriseMe!! ";

server_ip="http://139.59.9.19:8000/api/";
server_img_ip="http://139.59.9.19:8000";
login="login";
register="register";
showSurprise="showSurprise";
completeSurprise="completeSurprise";
skipSurprise="skipSurprise";
activity="wall";

username="";
credits=0;
skip_credits=0;
challenge_id=0;
challenge="";
challenge_credits=0;
last_received_wall_challenge_id = 0;

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
	if (page === "login" || page === "logout") {
		console.log(LOG_PREPEND + "Showing login page");
		$("#login").show();
		$("#challenge").hide();
		$("#wall").hide();
		$("#navbar").hide();
		$("#surpriseme").hide();
		$("#skipsurprisebutton").hide();
		$("#completebutton").hide();

		//clear out the user_id and password
		$("#userid").val("");
		$("#password").val("");

	} else if (page === "challenge") {
		console.log(LOG_PREPEND + "Showing challenge page");
		$("#login").hide();
		$("#challenge").show();
		$("#wall").hide();
		$("#surpriseme").show();
		$("#skipsurprisebutton").hide();
		$("#completebutton").hide();

	} else if (page === "wall") {
		console.log(LOG_PREPEND + "Showing activity wall page");
		$("#login").hide();
		$("#challenge").hide();
		$("#wall").show();

		// clear wall contents
		$("#getWallContainers").html("");
		getWallcontents();

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

	doAjaxJSON(login, str, function(data) {
		var obj = JSON.parse(data);
		if (!obj.verified) {
			Materialize.toast("Invalid Username or password", 4000);
			console.log(LOG_PREPEND + "Invalid Username or password");
			$("#password").val("");
			$("#userid").val("");
			return;
		}
		username = obj.name;
		credits = obj.credits;
		showPage("challenge");
		$("#bpoints").html(credits);
		$("#navbar").show();

		Materialize.toast('Welcome ' + username, 4000);
	});
}

function sendRegister() {
	var obj = new Object();
	obj.user = $("#userid").val();
	username = obj.user;
	obj.password = $("#password").val();

	var str = JSON.stringify(obj);
	console.log(LOG_PREPEND + str);

	doAjaxJSON(register, str, function(data) {
		var obj = JSON.parse(data);
		if (!obj.verified) {
			Materialize.toast("Invalid Username or password", 4000);
			console.log(LOG_PREPEND + "Invalid Username or password");
			$("#password").val("");
			$("#userid").val("");
			return;
		}

		username = obj.name;
		credits = obj.credits;
		showPage("challenge");
		$("#bpoints").html(credits);
		$("#navbar").show();

		Materialize.toast('User Registered Successfully!', 4000);
	});
}

function sendShowSurprise() {
	var obj = new Object();
	obj.user = username;

	var str = JSON.stringify(obj);
	console.log(LOG_PREPEND + str);

	doAjaxJSON(showSurprise, str, function(data) {
		var obj = JSON.parse(data);
		challenge_id = obj.id;
		challenge = obj.challenge;
		challenge_credits = obj.credits;
		skip_credits = obj.skip_credits;
		console.log(data);
		console.log(skip_credits);
		console.log(challenge);

		$("#surpriseme").hide();
		$("#skipsurprisebutton").show();
		$("#skipcost").html(skip_credits);
		if( challenge.indexOf("youtube") != -1 ){
			htmltoappend = "";
			htmltoappend = htmltoappend + "Watch this video to complete the task<br>";
			if( challenge.indexOf("autoplay=0")!= -1 )
				challenge = challenge.replace("autoplay=0","");
			if( challenge.indexOf("autoplay=1")!= -1 )
				challenge = challenge.replace("autoplay=1","");
			if( challenge.indexOf("controls=1")!= -1 )
				challenge = challenge.replace("controls=1","");
			if( challenge.indexOf("controls=0")!= -1 )
				challenge = challenge.replace("controls=0","");
			if( challenge.indexOf("?")!= -1 )
				htmltoappend = htmltoappend + '<iframe width="560" height="315" src="'+challenge+'autoplay=0&controls=0" frameborder="0" allowfullscreen></iframe>';
			else
				htmltoappend = htmltoappend + '<iframe width="560" height="315" src="'+challenge+'?autoplay=0&controls=0" frameborder="0" allowfullscreen></iframe>';
			$("#surprisetext").html(htmltoappend);
		}else if(challenge.challenge_type == "ARTICLE"){
			htmltoappend = "";
			htmltoappend = htmltoappend + "Read this article to complete the task<br>";
			htmltoappend = htmltoappend + '<iframe width="560" height="315" src="'+challenge+'" frameborder="0" allowfullscreen></iframe>';
			$("#surprisetext").html(htmltoappend);
		}else{
			$("#completebutton").show();
			$("#surprisetext").html(challenge);
		}
	});
}

function sendSkipSurprise() {
	var obj = new Object();
	obj.user = username;
	obj.id = challenge_id;

	var str = JSON.stringify(obj);
	console.log(LOG_PREPEND + str);

	doAjaxJSON(skipSurprise, str, function(data) {
		credits -= skip_credits;
		$("#bpoints").html(credits);

		var obj = JSON.parse(data);
		challenge_id = obj.id;
		challenge = obj.challenge;
		challenge_credits = obj.credits;
		credits = obj.credits;
		skip_credits = obj.skip_credits;

		$("#skipcost").text(skip_credits);
		$("#surprisetext").text(challenge);
	});
}

function sendCompleteSurprise() {
	var cam = new Object();
	cam.saveToPhotoAlbum = false;
	cam.destinationType = Camera.DestinationType.DATA_URL;
	cam.targetWidth = 400;
	cam.targetHeight = 400;

	navigator.camera.getPicture(
		function (data) {
			console.log(LOG_PREPEND + "Picture success");
			var obj = new Object();
			obj.user = username;
			obj.id = challenge_id;
			obj.photo = data;

			var str = JSON.stringify(obj);
			console.log(LOG_PREPEND + str);

			doAjaxJSON(completeSurprise, str, function(data) {
				var obj = JSON.parse(data);
				if (obj.success) {
					console.log(LOG_PREPEND + "Server unable to save");
					return;
				}
				Materialize.toast('Posted to the wall', 4000);
				credits += challenge_credits;
				$("#bpoints").html(credits);
			});
		},
		function (msg) {
			// error
			Materialize.toast("Unable to take a picture. Please try again.", 4000);
			console.log(LOG_PREPEND + "Picture failed: " + msg);
			return;
		},
		cam
	);
}

function doAjaxJSON(page, my_data, callback) {
	$("#loadinggif").show();
	$.ajax({
		url: server_ip + page,
		type: "POST",
		dataType: "xml/html/script/json",
		contentType: "application/json",
		data: my_data,

		complete: function(data) {
			$("#loadinggif").hide();
			console.log(data);
			if(data.status == 200 && data.readyState == 4) {
				callback(data.responseText);
			} else {
				Materialize.toast("Unable to contact server. Please try again later.", 4000);
				console.log("Unable to contact server (" + server_ip + page + "), try again...");
			}
		}
	});
}

function getWallcontents() {
	var obj = new Object();
	obj.last_challenge_id = last_received_wall_challenge_id;
	var str = JSON.stringify(obj);
	console.log(LOG_PREPEND + str);

	doAjaxJSON(activity, str, function(data) {
		var obj = JSON.parse(data);
		$.each( obj , function( key, value ) {
			var photo_ip = server_img_ip + value.photo;
			var time_ago = timeDifference(Date.now() , value.timestamp * 1000);
			var user_name = value.user;
			var challenge_desc = value.challenge;

			var pre_appender = "<div class='row  grey lighten-2 black-text text-darken-2 z-depth-3'> \
								<div class='col s4 m4 l4'> \
									 <img src='"+ photo_ip + "' class='wall-image' /> <br>\
									 <span class='card-title centercontent grey-text text-darken-1'> " + time_ago + " </span> \
								</div>\
								<div class='col s8 m8 l8'> \
									 <h6> <b>" + user_name + "</b> just attempted the challenge <br><br>"+ challenge_desc +"</h6>\
								</div>\
								</div> ";
				  $("#getWallContainers").append(pre_appender);
			});
	});
}

function timeDifference(current, previous) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';
    } else if (elapsed < msPerMonth) {
        return 'about ' + Math.round(elapsed/msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
        return 'about ' + Math.round(elapsed/msPerMonth) + ' months ago';
    } else {
        return 'about ' + Math.round(elapsed/msPerYear ) + ' years ago';
    }
}
