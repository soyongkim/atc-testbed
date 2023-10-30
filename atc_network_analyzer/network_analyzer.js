const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 50000;

app.use(cors());

app.use(bodyParser.json());

app.get('/', function (req, res) {
    console.log("Good");
    res.header()
    res.send('Hello World!');
  });

app.post('/', (req, res) => {
    console.log(req.body);
    var id = req.body.id;
    var bitrate = req.body.bitrate;

    console.log("ID: " + id + " Bitrate:" + bitrate);

    res.json({
        success: true,
    });
});

app.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
});