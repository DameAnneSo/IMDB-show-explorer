# Performance Optimization Architecture

## Data Loading Flow

### Before Optimization
```
User loads page
    ↓
Load imdb_top_tv_shows.csv (72KB) ────┐
Load imdb_episodes.csv (951KB) ───────┤
    ↓                                 ├─── Wait for both
Parse & calculate metadata ←──────────┘
    ↓
Render ALL 250 charts immediately
    ↓
25,000+ DOM nodes
⏱️ 3-5 seconds to interactive
```

### After Optimization
```
User loads page
    ↓
Load imdb_top_tv_shows_base.csv (33KB) ─┐
Load imdb_episodes.csv (951KB) ─────────┤
Load metadata.json (1KB) ───────────────┤
    ↓                                    ├─── Parallel
Parse data (metadata already computed) ←─┘
    ↓
Render ONLY visible ~5-10 charts ←─── Intersection Observer
    ↓
2,000-3,000 DOM nodes
⏱️ 1-2 seconds to interactive
    ↓
Background: Load storylines (39KB, non-blocking)
    ↓
On scroll: Render more charts lazily
```

## Component Architecture

### Charts Rendering

```
App.svelte
  │
  ├─→ Filters.svelte (instant with metadata.json)
  │
  └─→ Charts.svelte
       │
       └─→ LazyLineChart.svelte (for each show)
            │
            ├─→ [Not visible] → Shows placeholder
            │
            └─→ [Visible] → LineChart.svelte
                 ├─→ Points.svelte
                 ├─→ XAxis.svelte
                 ├─→ YAxis.svelte
                 └─→ SeasonBands.svelte
```

## Data Files Structure

### Original
```
public/data/
  └── imdb_top_tv_shows.csv (72KB)
       ├── rank, title, link
       ├── ratings, seasons, episodes
       ├── genres, language
       └── storyline (heavy!)
```

### Optimized
```
public/data/
  ├── imdb_top_tv_shows_base.csv (33KB)
  │    ├── rank, title, link
  │    ├── ratings, seasons, episodes
  │    └── genres, language
  │
  ├── imdb_top_tv_shows_details.csv (39KB)
  │    └── rank → storyline mapping
  │
  └── metadata.json (1KB)
       ├── genres[] (26 items)
       ├── languages[] (32 items)
       └── minSeasons/maxSeasons
```

## Filter Performance

### Before
```
User changes filter
    ↓
Loop through 250 shows ────┐
Check genres (string ops)  │
Check language (string ops)├─── O(n * m)
Check seasons              │
    ↓                      │
Loop through 17k episodes ─┤
Use array.includes() ←─────┘ (O(n * m))
    ↓
Re-render charts
```

### After
```
User changes filter
    ↓
Loop through 250 shows ──────┐
Check seasons (fast number) │
Check genres (cached lower) ├─── O(n)
Check language (cached)     │
    ↓                       │
Create Set of ranks (O(n))  │
Loop through 17k episodes ──┤
Use set.has() ←─────────────┘ (O(n))
    ↓
Re-render only visible charts
```

## Lazy Loading Timeline

```
Time 0ms: Page loads
    ├─ Base data loaded (33KB)
    ├─ Metadata loaded (1KB)
    └─ Episodes loaded (951KB)
    
Time 100ms: Interactive
    └─ Visible charts #1-5 rendered
    
Time 200ms: Background
    └─ Storylines loaded (39KB)
    
Time 300ms: User scrolls
    └─ Charts #6-10 rendered
    
Time 400ms: User scrolls more
    └─ Charts #11-15 rendered
    
...and so on
```

## Memory Footprint

### DOM Nodes
- Before: 25,000+ nodes (all charts)
- After: 2,000-3,000 nodes (visible only)
- Savings: ~90%

### Network Payload (Initial)
- Before: 72KB + 951KB = 1023KB
- After: 33KB + 951KB + 1KB = 985KB
- Savings: 38KB (3.7%)

### Network Payload (Total with storylines)
- Before: 1023KB
- After: 985KB + 39KB = 1024KB
- Note: Storylines load async, non-blocking

## Key Performance Metrics

| Operation | Before | After | Method |
|-----------|--------|-------|--------|
| Initial render | 250 charts | 5-10 charts | IntersectionObserver |
| Filter metadata | Runtime calc | Pre-computed | metadata.json |
| Episode filter | O(n*m) | O(n) | Set.has() |
| Data parsing | Full dataset | Split load | Async storylines |
| DOM updates | All charts | Visible only | Lazy rendering |
