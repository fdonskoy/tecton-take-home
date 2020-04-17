const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
const csv = require('csvtojson');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/datasets', (req, res) => {
    axios.get("https://s3-us-west-2.amazonaws.com/tecton.ai.public/coding_exercise_1/tables.json").then(datasets => {
        res.send(datasets.data);
    }).catch(err => {
        throw new Error(err);
    });
});

app.post('/api/dataset', (req, res) => {
    axios.get(req.body.url).then(dataset => {
        csv().fromString(dataset.data).then(json => {
            const columnSummary = {};

            const keys = Object.keys(json[0]);
            json.forEach(row => {
                for (let key of keys) {
                    const val = row[key];
                    if (!isNaN(val)) {
                        if (!columnSummary[key]) {
                            columnSummary[key] = {
                                min: val,
                                max: val,
                                sum: val,
                            }
                        } else {
                            const max = columnSummary[key].max;
                            const min = columnSummary[key].min;
                            columnSummary[key] = {
                                min: val < min ? val : min,
                                max: val > max ? val : max,
                            }
                        }
                    }
                }
            });
            res.send({
                rows: json,
                columnSummary: columnSummary,
            });
        });
    }).catch(err => {
        throw new Error(err);
    });
});

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'build')));

    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}

app.listen(port, () => console.log(`Listening on port ${port}`));