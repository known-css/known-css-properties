/*
 * Generate all.json
 */

const fs = require('fs');
const { resolve } = require('path');
const globby = require('globby');
const uniq = require('lodash.uniq');
const sortBy = require('lodash.sortBy');

const w3cProperties = require(resolve(__dirname, '../source/w3c')).properties;

const OUTPUT = resolve(__dirname, '../data/all.json');
const BROWSERS_SRC = resolve(__dirname, '../source/browsers');
const SORT_PATTERN = new RegExp('^-(webkit|moz|ms|o|apple|wap)-(.*)')

const readData = (filepath) => new Promise((resolve, reject) => 
    fs.readFile(filepath, (err, content) =>
        err ? reject(err) : resolve(JSON.parse(content))
    )
);

const getUniqueProperties = (browsers) => sortBy(
    uniq(
        w3cProperties.concat(
            ...browsers.map(browser => browser.properties)
    )),

    (prop) => prop.replace(SORT_PATTERN, '$2-$1')
);

const saveData = (properties) => new Promise((resolve, reject) =>
    fs.writeFile(OUTPUT, JSON.stringify({ properties }, null, 2), err => 
        err ? reject(err) : resolve(`Done generating ${OUTPUT}`)
    )
);

globby('*.json', { cwd: BROWSERS_SRC, absolute: true })
    .then(files => Promise.all(files.map(readData)))
    .then(getUniqueProperties)
    .then(saveData)
    .then(console.log)
    .catch(console.error)
