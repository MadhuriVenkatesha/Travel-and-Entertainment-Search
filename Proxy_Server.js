var express = require('express');
var app = express();
app.use(express.static('images_dir',{ maxAge: 100 }));
var fs = require("fs");
var request=require("request");
var path = require('path');

var cors = require('cors')
app.use(cors());
app.get('/fetch', function (req, res) {
    console.log("in here");
    var radius=req.query.radius;
    var location=req.query.location;
    var key=req.query.key;
    var type=req.query.type;
    var keyword=req.query.keyword;
    var URL="https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+location+"&radius="+radius.toString()+"&type="+type+"&keyword="+keyword+"&key="+key;
    request(URL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body); // Print the google web page.
        }
    });
})
app.get('/fetchReviews', function (req, res) {
    var id = req.query.id;
    var key=req.query.key;
    var URL="https://maps.googleapis.com/maps/api/place/details/json?placeid="+id+"&key="+key;
    request(URL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body); // Print the google web page.
        }
    });
})

app.get('/savePhotos', function (req, res) {
    var ht = req.query.height;
    var wd = req.query.width;
    var reference = req.query.reference;
    var key=req.query.key;
    var counter = req.query.counter;
    console.log("called me")
    var URL="https://maps.googleapis.com/maps/api/place/photo?maxwidth="+wd.toString()+"&maxheight="+ht.toString()+"&photoreference="+reference+"&key="+key
    request.get(URL).on('response', function(response) {
        console.log(response.statusCode) // 200
        console.log(response.headers['content-type']) // 'image/png'
        res.send("success");
    })
        .pipe(fs.createWriteStream(__dirname+'/images_dir/'+counter.toString()+'image.jpeg'))
})

app.get('/images', function (req, res) {
    var i = req.query.i;
        fs.stat(__dirname+'/images_dir/'+i.toString()+'image.jpeg', function(err,stat) {
            if (err==null) {
                console.log("exists")
                res.status(200).send('http://127.0.0.1:8081/'+i.toString()+'image.jpeg')
            }
            else{
                check=false;
            }
        });
    //res.send("found");
})

app.get('/serverPhotos',function (req,res) {
    var i = req.query.i;
    fs.readFile(__dirname+'/images_dir/'+i.toString()+'image.jpeg', function (err, data) {
        if (err==null){
            res.end(data);
        }
    });
})

var server = app.listen(8081, function () {

    console.log("Example app listening at http://8081")
})

/*var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})*/