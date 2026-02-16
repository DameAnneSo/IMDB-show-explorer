import fs from 'fs';

// Read the base file
const csvContent = fs.readFileSync('public/data/imdb_top_tv_shows_base.csv', 'utf-8');
const lines = csvContent.split('\n');

// Parse CSV properly handling quoted fields
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

// Parse data
const shows = [];
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;

  const cols = parseCSVLine(lines[i]);
  const show = {
    rank: parseInt(cols[0]),
    title: cols[1],
    genres: cols[7], // Index 7 based on header
    language: cols[8], // Index 8 based on header
    seasons: parseInt(cols[5]), // Index 5 based on header
  };
  shows.push(show);
}

// Compute metadata
const genresSet = new Set();
const languagesSet = new Set();
const seasonCounts = [];

shows.forEach((show) => {
  // Extract genres
  if (show.genres) {
    show.genres.split(',').forEach((genre) => {
      const cleanGenre = genre.trim().replace(/"/g, '');
      if (cleanGenre && cleanGenre.length > 0) {
        genresSet.add(cleanGenre);
      }
    });
  }

  // Extract language
  if (show.language) {
    const cleanLang = show.language.trim().replace(/"/g, '');
    if (cleanLang && cleanLang.length > 0 && !cleanLang.includes(',')) {
      languagesSet.add(cleanLang);
    }
  }

  // Collect season counts
  if (show.seasons > 0 && !isNaN(show.seasons)) {
    seasonCounts.push(show.seasons);
  }
});

// Create metadata object
const metadata = {
  totalShows: shows.length,
  genres: Array.from(genresSet).sort(),
  languages: Array.from(languagesSet).sort(),
  minSeasons: Math.min(...seasonCounts),
  maxSeasons: Math.max(...seasonCounts),
  generatedAt: new Date().toISOString(),
};

// Write metadata file
fs.writeFileSync('public/data/metadata.json', JSON.stringify(metadata, null, 2));

console.log('✅ Metadata file generated!');
console.log(`Total shows: ${metadata.totalShows}`);
console.log(`Genres: ${metadata.genres.length}`);
console.log(`Languages: ${metadata.languages.length}`);
console.log(`Season range: ${metadata.minSeasons}-${metadata.maxSeasons}`);
