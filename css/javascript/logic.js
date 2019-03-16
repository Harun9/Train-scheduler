$(document).ready(function() {
    //1. Initialize Firebase

    var config = {
        apiKey: "AIzaSyCJoY4xGJEv_sYmanQdoZkrvCZ3NTF0xTQ",
        authDomain: "traintime-ccbb8.firebaseapp.com",
        databaseURL: "https://traintime-ccbb8.firebaseio.com",
        projectId: "traintime-ccbb8",
        storageBucket: "traintime-ccbb8.appspot.com",
        messagingSenderId: "156173247027"
    }
    firebase.initializeApp(config);

    //create variable to refernce database
    var database = firebase.database();


    //create button to add train


    $("#submit").on("click", function() {
        event.preventDefault();


        //user input

        var name = $("#nameInput").val().trim();
        var destination = $("#destinationInput").val().trim();
        var time = $("#timeInput").val().trim();
        var frequency = $("#frequencyInput").val().trim();

        console.log(name);
        console.log(destination);
        console.log(time);
        console.log(frequency);

        //push data to the firebase
        database.ref().push({
            name: name,
            destination: destination,
            time: time,
            frequency: frequency,
            timeAdded: firebase.database.ServerValue.TIMESTAMP
        });

    });

    database.ref().on("child_added", function(childSnapshot) {
            // console.log(childSnapshot.val());
            var name = childSnapshot.val().name;
            var destination = childSnapshot.val().destination;
            var time = childSnapshot.val().time;
            var frequency = childSnapshot.val().frequency;

            console.log("Name: " + name);
            console.log("Destination: " + destination);
            console.log("Time: " + time);
            console.log("Frequency: " + frequency);

            //CONVERT TRAIN TIME
            var frequency = parseInt(frequency);
            //CURRENT TIME
            var currentTime = moment();
            console.log("CURRENT TIME: " + moment().format('HH:mm'));

            //FIRST TIME: PUSHED BACK ONE YEAR TO COME BEFORE CURRENT TIME

            var dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
            console.log("DATE CONVERTED: " + dConverted);
            var trainTime = moment(dConverted).format('HH:mm');
            console.log("TRAIN TIME : " + trainTime);

            //DIFFERENCE B/T THE TIMES 
            var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
            var tDifference = moment().diff(moment(tConverted), 'minutes');
            console.log("DIFFERENCE IN TIME: " + tDifference);

            //REMAINDER 
            var tRemainder = tDifference % frequency;
            console.log("TIME REMAINING: " + tRemainder);

            //MINUTES UNTIL NEXT TRAIN
            var minsAway = frequency - tRemainder;
            console.log("MINUTES UNTIL NEXT TRAIN: " + minsAway);
            //NEXT TRAIN
            var nextTrain = moment().add(minsAway, 'minutes');
            console.log("ARRIVAL TIME: " + moment(nextTrain).format('HH:mm A'));
            //console.log(==============================);
            console.log(minsAway);
            console.log(nextTrain);




            //APPEND TO DISPLAY IN TRAIN TABLE
            $('#currentTime').text(currentTime);
            $('#trainTable').append(
                "<tr><td id='nameDisplay'>" + childSnapshot.val().name +
                "</td><td id='destinationDisplay'>" + childSnapshot.val().destination +
                "</td><td id='frequencyDisplay'>" + childSnapshot.val().frequency +
                "</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
                "</td><td id='awayDisplay'>" + minsAway + ' minutes until arrival' + "</td></tr>");
        },
        function(errorObject) {
            console.log("Read failed: " + errorObject.code)


        });






});