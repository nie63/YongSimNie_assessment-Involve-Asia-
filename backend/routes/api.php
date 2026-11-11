<?php

use App\Http\Controllers\PokemonController;
use Illuminate\Support\Facades\Route;

// Aggregates paginated Pokémon data for the Next.js frontend.
Route::get('/pokemons', [PokemonController::class, 'index']);
