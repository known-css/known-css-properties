/*
 * Generate all.json
 */

const fs = require('fs');
const { resolve } = require('path');
const uniq = require('lodash.uniq');
const sortBy = require('lodash.sortBy');

const w3cProperties = require(resolve(__dirname, '../source/w3c')).properties;
const browserEntries = require(resolve(__dirname, '../source/browsers-properties')).entries;

const OUTPUT = resolve(__dirname, '../data/all.json');
const SORT_PATTERN = new RegExp('^-(webkit|moz|ms|o|apple|wap)-(.*)')


// Prepare data

const properties = sortBy(
    uniq(
        w3cProperties.concat(
            ...browserEntries.map(entry => entry.properties)
        )
    ),

    (prop) => prop.replace(SORT_PATTERN, '$2-$1')
);


// Save data

fs.writeFile(OUTPUT, JSON.stringify({ properties }, null, 2), (err) => {
    if (err) {
        return console.error(err);
    }

    return console.log(`Done generating ${OUTPUT}`);
})

