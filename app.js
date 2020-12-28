const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { json } = require("body-parser");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + '/signup.html');
});

app.post("/", function(req, res){
    const firstName = req.body.firstNameInput;
    const lastName = req.body.lastNameInput;
    const email = req.body.emailAddressInput;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us7.api.mailchimp.com/3.0/lists/0b4c73b4b111"
    const options = {
        method: "POST",
        auth: "fidelhen:73a0138e3878f9b576a77337966314b8-us7"
    }

    const request = https.request(url, options, function(response){
        const statusCode = response.statusCode;

        if (statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data)) 
        });
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
});

//Heroku and Local deployment
app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000.");
});
