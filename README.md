# 📺 IMDb Top TV Shows Explorer

An interactive data visualization tool for exploring and analyzing the [IMDb Top 250 TV shows](https://www.imdb.com/chart/toptv/). With countless TV shows available, this project makes it easier to discover your next binge-worthy series by providing interactive filters and visualizations of episode ratings across seasons.

🔗 **[View Live Demo](https://imdb-show-explorer.vercel.app/)**

## 🎯 What This Project Does

This tool allows you to:

- **Filter** IMDb's top-rated TV shows by genre, language, and number of seasons
- **Visualize** episode ratings across all seasons to see which shows maintain their quality
- **Explore** detailed information about each show including storylines, ratings, and time ranges
- **Discover** trends and patterns in TV show ratings over time

The visualization uses line charts to display episode ratings, making it easy to spot shows that stay consistently great or identify which seasons are worth watching.

## 🛠️ Built With

This project uses modern web technologies for fast, interactive data visualization:

- **[Svelte 5](https://svelte.dev/)** - Reactive UI framework with runes for state management
- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
- **[D3.js](https://d3js.org/)** - Data visualization and manipulation library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager

All UI components (filters, charts, toggles, etc.) are built from scratch using Svelte and Tailwind CSS.

Additional development tools:

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks for code quality
- **lint-staged** - Run linters on staged git files

## 👥 Authors

**Anne-Sophie Pereire**

- GitHub: [@DameAnneSo](https://github.com/DameAnneSo)
- Website: [curiousdata.netlify.app](https://curiousdata.netlify.app/)

**Leandro Collares**

- GitHub: [@leandrocollares](https://github.com/leandrocollares)
- Website: [leandrocollares.vercel.app](https://leandrocollares.vercel.app)

## 📊 Data Source

The data is sourced from [IMDb's Top 250 TV shows](https://www.imdb.com/chart/toptv/) list, which ranks shows by a formula that includes:

- Number of ratings from users
- Value of ratings from regular users
- Minimum of 10,000 user ratings for series/mini-series
- Minimum of 5 aired episodes for TV series

## 🚀 Local Installation

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **pnpm** (if not installed, run: `npm install -g pnpm`)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/tv-shows-playground.git
   cd tv-shows-playground
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   ```

4. **Open in browser**

   The app will be running at `http://localhost:5173` (or another port if 5173 is in use)

### Additional Commands

- **Build for production**

  ```bash
  pnpm build
  ```

- **Preview production build**

  ```bash
  pnpm preview
  ```

- **Lint code**

  ```bash
  pnpm lint
  ```

- **Format code**

  ```bash
  pnpm format
  ```

- **Prepare/update data** (if you have new IMDb data)
  ```bash
  pnpm prepare-data
  ```

## 📁 Project Structure

```
tv-shows-playground/
├── public/
│   └── data/              # CSV data files and metadata
├── scripts/               # Data preparation scripts
├── src/
│   ├── lib/              # Svelte components
│   │   ├── Charts.svelte
│   │   ├── Filters.svelte
│   │   ├── LineChart.svelte
│   │   └── ...
│   ├── App.svelte        # Main application component
│   └── main.js           # Application entry point
└── ...                   # Config files
```

## 📝 License

This project is open source and available for educational and personal use.

---

Made with ❤️ by Anne-Sophie and Leandro
