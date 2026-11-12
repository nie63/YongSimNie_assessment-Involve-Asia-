"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";

type Pokemon = {
  name: string;
  image: string | null;
  types: string[];
  height: number;
  weight: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
// keep the carousel independent from external image 
const slides = ["/carousel_image.jpg", "/carousel_image2.png", "/carousel_image3.jpeg"];
// page limit set to 24
const PAGE_LIMIT = 24;

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const loadPage = useCallback(async (nextPage: number) => {
    setIsLoading(true);
    setError("");
    try {
      // frontend calls Laravel for PokeAPI access.
      const response = await fetch(`${API_URL}/pokemons?page=${nextPage}&limit=${PAGE_LIMIT}`);
      if (!response.ok) throw new Error("The Pokémon service could not be reached.");
      const data: Pokemon[] = await response.json();
      setPokemons((current) => nextPage === 1 ? data : [...current, ...data]);
      setHasMore(data.length === PAGE_LIMIT);
      setPage(nextPage);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadPage(1), 0);
    return () => window.clearTimeout(timer);
  }, [loadPage]);
  const filteredPokemons = useMemo(
    () => pokemons.filter(({ name }) => name.includes(query.trim().toLowerCase())),
    [pokemons, query],
  );

  function handleListScroll() {
    const list = listRef.current;
    if (list && list.scrollTop + list.clientHeight >= list.scrollHeight - 80 && hasMore && !isLoading) {
      void loadPage(page + 1);
    }
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuery(searchTerm);
  }

  return (
    <main className={styles.page}>
      {/* UI Layout (Top section) - carousel & two static banners */}
      <section className={styles.hero} aria-label="Featured Pokémon">
        <div className={styles.carousel}>
          <div className={styles.carouselTrack}>
            {[...slides, ...slides].map((image, index) => <img key={`${image}-${index}`} src={image} alt="" />)}
          </div>
        </div>
        <div className={styles.sideBanners}>
          <div className={styles.sideBanner}><img src="/top_static_banner1.png" alt="Pokémon banner" /></div>
          <div className={`${styles.sideBanner} ${styles.darkBanner}`}><img src="/top_static_banner2.jpg" alt="Poké Ball banner" /></div>
        </div>
      </section>

      {/* Middle section - persistent when scrolling */}
      <section className={styles.pokedexShell}>
        <aside className={`${styles.artPanel} ${styles.leftArt}`}></aside>
        <div className={styles.collection}>
          <div className={styles.collectionHeading}><span className={styles.count}>{pokemons.length} loaded</span></div>
          <form className={styles.searchRow} onSubmit={handleSearch}>
            <div className={styles.search}><span>⌕</span><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search Pokemon name" />{searchTerm && <button type="button" aria-label="Clear search" onClick={() => { setSearchTerm(""); setQuery(""); }}>×</button>}</div>
            <button className={styles.searchSubmit} type="submit">Search</button>
          </form>
          <div ref={listRef} className={styles.pokemonList} onScroll={handleListScroll}>
            {filteredPokemons.map((pokemon) => (
              <article className={styles.card} key={pokemon.name}>
                <div className={styles.sprite}><img src={pokemon.image ?? "/top_static_banner2.jpg"} alt={pokemon.name} loading="lazy" /></div>
                <div className={styles.cardInfo}><h3>{pokemon.name}</h3><div className={styles.types}>{pokemon.types.map((type) => <span key={type} className={styles[type] ?? ""}>{type}</span>)}</div></div>
                <div className={styles.metrics}><span>HT <b>{pokemon.height / 10}m</b></span><span>WT <b>{pokemon.weight / 10}kg</b></span></div>
              </article>
            ))}
            {isLoading && <div className={styles.message}>Loading …</div>}
            {!isLoading && !filteredPokemons.length && <div className={styles.message}>No Pokémon found for “{query}”.</div>}
            {error && <div className={styles.message}><p>{error}</p><button onClick={() => void loadPage(1)}>Try again</button></div>}
          </div>
        </div>
        <aside className={`${styles.artPanel} ${styles.rightArt}`}></aside>
      </section>
    </main>
  );
}
