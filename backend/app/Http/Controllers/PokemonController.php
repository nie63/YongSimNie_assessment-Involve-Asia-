<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Client\Pool;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class PokemonController extends Controller
{
    private const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon';

    // Fetches a page from PokeAPI and returns the normalized assessment response.
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'page' => ['nullable', 'integer', 'min:1'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $page = (int) ($validated['page'] ?? 1);
        $limit = (int) ($validated['limit'] ?? 12);
        $offset = ($page - 1) * $limit;
        $cacheKey = "pokemons.page.{$page}.limit.{$limit}";

        try {
            $pokemons = Cache::remember($cacheKey, now()->addMinutes(10), function () use ($limit, $offset) {
                // Fetch the list first, then request each Pokémon's details concurrently.
                $list = Http::acceptJson()
                    ->timeout(10)
                    ->get(self::POKEAPI_URL, ['limit' => $limit, 'offset' => $offset])
                    ->throw()
                    ->json('results', []);

                $details = Http::pool(function (Pool $pool) use ($list) {
                    return collect($list)
                        ->map(fn (array $pokemon) => $pool->as($pokemon['name'])
                            ->acceptJson()
                            ->timeout(10)
                            ->get($pokemon['url']))
                        ->all();
                });

                return collect($list)
                    ->map(function (array $pokemon) use ($details) {
                        $detail = $details[$pokemon['name']];

                        if ($detail->failed()) {
                            throw new HttpException(502, "Unable to fetch details for {$pokemon['name']}.");
                        }

                        $data = $detail->json();

                        // Keep the frontend contract independent of PokeAPI's nested shape.
                        return [
                            'name' => $data['name'],
                            'image' => data_get($data, 'sprites.other.official-artwork.front_default')
                                ?? data_get($data, 'sprites.front_default'),
                            'types' => collect($data['types'] ?? [])
                                ->pluck('type.name')
                                ->values()
                                ->all(),
                            'height' => $data['height'],
                            'weight' => $data['weight'],
                        ];
                    })
                    ->values()
                    ->all();
            });
        } catch (HttpException $exception) {
            throw $exception;
        } catch (\Throwable $exception) {
            report($exception);

            throw new HttpException(502, 'The Pokémon service is temporarily unavailable.');
        }

        return response()->json($pokemons);
    }
}
