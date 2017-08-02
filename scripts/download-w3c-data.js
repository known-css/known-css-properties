const { writeFile } = require('fs');
const { resolve } = require('path');
const uniq = require('lodash.uniq');
const axios = require('axios');

const outputFile = resolve(__dirname, '../source/w3c.json');
const w3URL = 'https://www.w3.org/Style/CSS/all-properties.en.json';
const validStatuses = ['REC', 'CR', 'LC', 'WD', 'FPWD', 'ED'];

const isEntryValid = ({property, status}) =>
    !property.startsWith('--') && validStatuses.includes(status)

const saveData = (properties) =>
    new Promise((resolve, reject) => {
        writeFile(
            outputFile,
            JSON.stringify({ properties }, null, 2),
            (err, res) => err ? reject(err) : resolve(res)
        );
    });

axios.get(w3URL)
    .then(res => res.data.filter(isEntryValid))
    .then(properties => properties.map(({property}) => property))
    .then(properties => uniq(properties))
    .then(saveData)
    .catch(err => console.error(err));
