const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 50000;

var id_num = 0;
var max_num = 4;
var webrtc_data = [];

function update_webrtc_data(id, name, curData) {
    var search = false;
    for(var i=0; i<id_num; i++) {
        if(webrtc_data[i].id == id) {
            search = true;
            webrtc_data[i].data.splice(0, 1);
            webrtc_data[i].data[max_num] = curData;
            break;
        }
    }

    if(!search) {
        webrtc_data[id_num] = {};
        webrtc_data[id_num].id = id;
        webrtc_data[id_num].name = name;
        webrtc_data[id_num].data = [];
        for(var i=0; i<max_num-1; i++) {
            webrtc_data[id_num].data[i] = {};
            webrtc_data[id_num].data[i].rlaten = 0;
            webrtc_data[id_num].data[i].alaten = 0;
            webrtc_data[id_num].data[i].loss = 0;
            webrtc_data[id_num].data[i].bit = 0;
        }
        webrtc_data[id_num].data[max_num] = curData;
        id_num++;
    }
    console.log(webrtc_data);
}

const options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
};

app.use(cors());
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
  });

app.get('/webrtcdata', function (req, res) {
    res.json({
        success: true,
        dataset: webrtc_data
    });
});

app.post('/update', (req, res) => {
    //console.log(req.body);
    var id = req.body.id;
    var name = req.body.name;
    var data = req.body.data;

    //console.log("ID: " + id + " Bitrate:" + bitrate[0]);
    update_webrtc_data(id, name, data);
    res.json({
        success: true,
    });
});


var total_num = 0;
var total_latency = 0;
app.post('/iot_update', (req, res) => {
    //console.log(req.body);
    var latency = req.body.latency;
    total_latency += latency;
    total_num++;
    console.log("latency:" + latency + "/ Average latency:" + total_latency/latency);
    res.json({
        success: true,
    });
});


app.get('/delete', (req, res) => {
    //console.log(req.body);
    webrtc_data = [];
    id_num = 0;

    res.json({
        success: true,
    });
});


const servers = https.createServer(options, app);

// setInterval(function() {
//     for(var i=0; i<id_num; i++) {
//         if(data[i].num == max_num) {
//             data[i].bitrate.splice(0, 1);
//             data[i].bitrate[max_num] = data[i].bitrate[max_num-1];
//         }
//     }
//     console.log(data);
// }, 2000);


servers.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
})
// app.listen(port, () => {
//     console.log(`server is listening at localhost:${port}`);
// });