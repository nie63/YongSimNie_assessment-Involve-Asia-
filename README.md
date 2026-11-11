# Fullstack Pokédex

Pokédex app using the PokeAPI with a Laravel backend API for data aggregation and a Next.js frontend for display.
[PokeAPI](https://pokeapi.co/docs/v2).

## Requirements

- PHP 8.2+
- Composer
- Node.js 20+
- npm

## Run locally

### Backend

```bash
cd backend
copy .env.example .env
php artisan serve
```

The API is available at `http://localhost:8000/api/pokemons?page=1&limit=12`.

The endpoint validates `page` (minimum 1) and `limit` (1-50), fetches the list and details from PokeAPI concurrently, returns the requested normalized fields, and caches each page for 10 minutes.

### Frontend

```bash
cd frontend
copy .env.local.example .env.local
npm run dev
```

Open `http://localhost:3000`. 
The frontend calls only the Laravel endpoint. 
The center list has its own scroll container and automatically loads the next API page when the user reaches the bottom; 
The search field filters the pages already loaded.

## API response

`GET /api/pokemons?page=1&limit=12`

```json
[
  {
    "name": "bulbasaur",
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    "types": ["grass", "poison"],
    "height": 7,
    "weight": 69
  }
]
```

## Structure

- `backend/` Laravel 12 API and PokeAPI aggregation controller
- `frontend/` Next.js App Router UI
- `images/` assessment-supplied images used in frontend
