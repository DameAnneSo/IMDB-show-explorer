import fs from 'fs';

// Read the original file
const csvContent = fs.readFileSync('public/data/imdb_top_tv_shows.csv', 'utf-8');
const lines = csvContent.split('\n');
const header = lines[0];
const headerCols = header.split(',');

// Find the index of the storyline column
const storylineIndex = headerCols.indexOf('storyline');

// Split into base and details
const baseHeader = headerCols.filter((_, i) => i !== storylineIndex).join(',');
const detailsHeader = 'rank,storyline';

const baseLines = [baseHeader];
const detailsLines = [detailsHeader];

for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  
  // Split the line while handling quoted fields
  const cols = [];
  let currentCol = '';
  let inQuotes = false;
  
  for (let j = 0; j < lines[i].length; j++) {
    const char = lines[i][j];
    
    if (char === '"') {
      inQuotes = !inQuotes;
      currentCol += char;
    } else if (char === ',' && !inQuotes) {
      cols.push(currentCol);
      currentCol = '';
    } else {
      currentCol += char;
    }
  }
  cols.push(currentCol); // Add last column
  
  // Base data (without storyline)
  const baseCols = cols.filter((_, i) => i !== storylineIndex);
  baseLines.push(baseCols.join(','));
  
  // Details data (rank and storyline)
  detailsLines.push(`${cols[0]},${cols[storylineIndex]}`);
}

// Write files
fs.writeFileSync('public/data/imdb_top_tv_shows_base.csv', baseLines.join('\n'));
fs.writeFileSync('public/data/imdb_top_tv_shows_details.csv', detailsLines.join('\n'));

console.log('✅ Data split complete!');
console.log(`Base file: ${Buffer.byteLength(baseLines.join('\n'))} bytes`);
console.log(`Details file: ${Buffer.byteLength(detailsLines.join('\n'))} bytes`);
console.log(`Original file: ${Buffer.byteLength(csvContent)} bytes`);
console.log(`Savings: ${100 - (Buffer.byteLength(baseLines.join('\n')) / Buffer.byteLength(csvContent) * 100).toFixed(1)}% reduction in base file`);
