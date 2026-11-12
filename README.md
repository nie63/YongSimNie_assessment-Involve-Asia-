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

# API Documentation – Get Pokémon List

## 1. Endpoint

Retrieves a paginated list of Pokémon records, including their images, types, height and weight.

| Item | Details |
|---|---|
| **HTTP Method** | `GET` |
| **Endpoint** | `/api/pokemons` |
| **Full URL (Local)** | `http://localhost:8000/api/pokemons` |
| **Response Format** | JSON |
| **Success Status Code** | `200 OK` |

## 2. Query Parameters

The API supports pagination through the following query parameters:

| Parameter | Type | Required | Description | Default |
|---|---|---|---|---|
| `page` | Integer | No | Specifies the page number to retrieve. | `1` |
| `limit` | Integer | No | Specifies the maximum number of Pokémon records per page. | `12` |

**Example Request:**

```http
GET /api/pokemons?page=1&limit=12
```

This request retrieves the first page of Pokémon records, with up to 12 records per page.

## 3. Example API Request

```http
GET http://localhost:8000/api/pokemons?page=1&limit=12
```

## 4. Example API Response

**Status Code:** `200 OK`

```json
[
  {
    "name": "bulbasaur",
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    "types": [
      "grass",
      "poison"
    ],
    "height": 7,
    "weight": 69
  }
]
```

## 5. Response Field Descriptions

| Field | Data Type | Description |
|---|---|---|
| `name` | String | Name of the Pokémon. |
| `image` | String | URL of the Pokémon's image. |
| `types` | Array of Strings | Pokémon's elemental types. |
| `height` | Number | Pokémon's height. |
| `weight` | Number | Pokémon's weight. |

## 6. Pagination Examples

| Request | Description |
|---|---|
| `/api/pokemons?page=1&limit=12` | Retrieves the first 12 Pokémon. |
| `/api/pokemons?page=2&limit=12` | Retrieves the next 12 Pokémon. |
| `/api/pokemons?page=1&limit=5` | Retrieves the first 5 Pokémon. |
| `/api/pokemons?page=3&limit=5` | Retrieves Pokémon records 11–15, assuming the records are consistently ordered. |

## Structure

- `backend/` Laravel 12 API and PokeAPI aggregation controller
- `frontend/` Next.js App Router UI
- `images/` assessment-supplied images used in frontend
