import fs from 'fs/promises';
import path from 'path';
import uniq from 'lodash.uniq';

const outputFilepath = path.join(process.cwd(), 'source/w3c.json');
const url = 'https://www.w3.org/Style/CSS/all-properties.en.json';
const validStatuses = ['REC', 'CR', 'LC', 'WD', 'FPWD', 'ED'];

function isEntryValid ({ property, status }) {
  return !property.startsWith('--') && validStatuses.includes(status);
}

async function saveData(properties) {
  return fs.writeFile(outputFilepath, JSON.stringify({ properties }, null, 2));
}

async function downloadData() {
  const res = await fetch(url);
  return res.json();
}

(async () => {
  const response = await downloadData();

  const allProperties = response.filter(isEntryValid).map(({ property }) => property);
  const properties = uniq(allProperties);

  await saveData(properties);
})()
