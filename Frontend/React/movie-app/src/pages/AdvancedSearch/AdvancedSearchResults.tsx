import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';
import { useDebounce } from '../../utils/useDebounce';
import './advanced-search.css';

interface MovieProduct {
  id: number;
  title: string;
  description: string;
  averageRating: number;
  durationMinutes: number;
  posterUrl: string;
  releaseDate: string;
}

const MovieItem = React.memo(
  ({
    movie,
    onClick,
  }: {
    movie: MovieProduct;
    onClick: (id: number) => void;
  }) => {
    return (
      <div
        className="movie-item-card"
        onClick={() => onClick(movie.id)}
        style={{ cursor: 'pointer' }}
      >
        <div className="movie-item-details">
          <strong>{movie.title}</strong>
          <span>Ocena: {movie.averageRating}/10</span>
        </div>

        <div className="movie-item-price">
          {movie.durationMinutes} min
        </div>
      </div>
    );
  }
);

const AdvancedSearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);

  const [movies, setMovies] = useState<MovieProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const hasFetchedRef = React.useRef(false);

  useEffect(() => {
    document.title = `Wyniki wyszukiwania: ${
      debouncedQuery || 'wszystko'
    }`;

    let metaDesc = document.querySelector(
      'meta[name="description"]'
    );

    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }

    metaDesc.setAttribute(
      'content',
      `Zobacz wyniki wyszukiwania dla frazy: ${debouncedQuery}`
    );
  }, [debouncedQuery]);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchMovies = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          'http://localhost:8080/api/v1/movies/first/10000'
        );

        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error('Błąd podczas pobierania filmów', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) =>
      movie.title
        .toLowerCase()
        .includes(debouncedQuery.toLowerCase())
    );
  }, [movies, debouncedQuery]);

  const handleQueryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newQuery = e.target.value;

    setQuery(newQuery);

    setSearchParams({ q: newQuery }, { replace: true });
  };

  const handleMovieClick = (id: number) => {
    navigate(`/movie-page/${id}`);
  };

  return (
    <div className="search-results-container">
      <div className="search-results-header">
        <h2>Wyniki wyszukiwania</h2>

        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Wyszukaj film..."
        />
      </div>

      <div className="search-results-info">
        {loading && <p>Ładowanie filmów...</p>}

        {!loading && (
          <p>
            Znaleziono rekordów:{' '}
            {filteredMovies.length}
          </p>
        )}
      </div>

      <div className="search-results-list">
        {!loading && filteredMovies.length === 0 ? (
          <p>Brak wyników</p>
        ) : (
          <Virtuoso
            style={{
              height: '600px',
              width: '100%',
            }}
            data={filteredMovies}
            itemContent={(_index, movie) => (
              <MovieItem
                movie={movie}
                onClick={handleMovieClick}
              />
            )}
          />
        )}
      </div>
    </div>
  );
};

export default AdvancedSearchResults;