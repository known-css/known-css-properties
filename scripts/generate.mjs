/*
 * Generate all.json
 */
import fs from 'fs/promises';
import path from 'path';
import { globby } from 'globby';
import uniq from 'lodash.uniq';
import sortBy from 'lodash.sortby';

const W3C_SOURCE_FILEPATH = path.join(process.cwd(), 'source/w3c.json');
const UNKNOWN_FILEPATH = path.join(process.cwd(), 'source/unknown.json');
const BROWSERS_SOURCE_DIR = path.join(process.cwd(), 'source/browsers');
const SORT_PATTERN = new RegExp('^-(khtml|konq|webkit|moz|ms|o|apple|wap)-(.*)')
const OUTPUT = path.join(process.cwd(), 'data/all.json');

async function readJSON(filepath) {
  const content = await fs.readFile(filepath, 'utf8');
  return JSON.parse(content);
}

async function saveJSON(properties) {
  return fs.writeFile(OUTPUT, JSON.stringify({ properties }, null, 2));
}

(async () => {
  const browserSourceFilepaths = await globby('*.json', { cwd: BROWSERS_SOURCE_DIR, absolute: true });
  const sourceFilepaths = [W3C_SOURCE_FILEPATH, UNKNOWN_FILEPATH, ...browserSourceFilepaths];

  const data = await Promise.all(sourceFilepaths.map(readJSON));
  const allProperties = data.map(({ properties }) => properties).flat();
  const properties = sortBy(uniq(allProperties), (prop) => prop.replace(SORT_PATTERN, '$2-$1'));

  await saveJSON(properties);

  console.log(`Done generating ${OUTPUT}`);
})();
