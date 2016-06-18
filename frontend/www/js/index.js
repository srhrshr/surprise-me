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

server_ip="http://localhost/";
username="";
credits=0;
login="login";
activity="activity";

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
	$(".button-collapse").sideNav();
	showPage("login");
}

function showPage(page) {
	console.log("fun running");
	if (page === "login") {
		$("#login").show();
		$("#challenge").hide();
		$("#wall").hide();

	} else if (page === "challenge") {
		$("#login").hide();
		$("#challenge").show();
		$("#wall").hide();

	} else if (page === "wall") {
		$("#login").hide();
		$("#challenge").hide();
		$("#wall").show();

	} else {
		console.log ("Invalid Page Called: " + page);
	}
}

function sendLogin() {
	var obj = new Object();
	obj.user = $("#userid");
	obj.password = $("#password");

	var str = JSON.stringify(obj);
	console.log(str);
	$.post(server_ip+login, str, function(data, status) {
		console.log(data);
		var obj = JSON.parse(data);
		if (!obj.verified) {
			console.log("Not verified");
			alert("User Not Verified");
		}
		username = obj.name;
		credits = obj.credits;
		showPage("challenge");
	});
}

