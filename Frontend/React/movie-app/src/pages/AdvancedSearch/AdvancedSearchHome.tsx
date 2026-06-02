import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../utils/useDebounce';
import './advanced-search.css';

interface MovieProduct {
    id: number;
    title: string;
}

const AdvancedSearchHome = () => {
    const [searchPhrase, setSearchPhrase] = useState('');
    const [movies, setMovies] = useState<MovieProduct[]>([]);
    const [suggestions, setSuggestions] = useState<MovieProduct[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debouncedSearchPhrase = useDebounce(searchPhrase, 300);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Wyszukiwarka Filmów - Strona Główna';

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
            'Główna strona zaawansowanej wyszukiwarki filmów. Znajdź swój ulubiony film.'
        );
    }, []);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(
                    'http://localhost:8080/api/v1/movies/first/10000'
                );

                const data = await response.json();

                setMovies(data);
            } catch (error) {
                console.error(
                    'Błąd podczas pobierania filmów',
                    error
                );
            }
        };

        fetchMovies();
    }, []);

    useEffect(() => {
        if (!debouncedSearchPhrase.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const filtered = movies
            .filter(movie =>
                movie.title
                    .toLowerCase()
                    .includes(
                        debouncedSearchPhrase.toLowerCase()
                    )
            )
            .slice(0, 5);

        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
    }, [debouncedSearchPhrase, movies]);

    const handleSearch = (query?: string) => {
        const finalQuery =
            typeof query === 'string'
                ? query
                : searchPhrase;

        if (finalQuery.trim()) {
            navigate(
                `/advanced-search/results?q=${encodeURIComponent(
                    finalQuery
                )}`
            );
        }
    };

    return (
        <div className="search-home-container">
            <h1>Zaawansowana Wyszukiwarka Filmów</h1>

            <p>
                Wyszukuj filmy spośród 10 000 rekordów
                zapisanych w bazie danych.
            </p>

            <div className="search-input-group">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        placeholder="Wpisz nazwę filmu..."
                        value={searchPhrase}
                        onChange={(e) =>
                            setSearchPhrase(
                                e.target.value
                            )
                        }
                        onBlur={() =>
                            setTimeout(
                                () =>
                                    setShowSuggestions(
                                        false
                                    ),
                                200
                            )
                        }
                        onFocus={() => {
                            if (
                                suggestions.length > 0
                            ) {
                                setShowSuggestions(
                                    true
                                );
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />

                    {showSuggestions &&
                        suggestions.length > 0 && (
                            <ul className="search-suggestions">
                                {suggestions.map(
                                    movie => (
                                        <li
                                            key={
                                                movie.id
                                            }
                                            onClick={() => {
                                                setSearchPhrase(
                                                    movie.title
                                                );

                                                handleSearch(
                                                    movie.title
                                                );
                                            }}
                                        >
                                            {
                                                movie.title
                                            }
                                        </li>
                                    )
                                )}
                            </ul>
                        )}
                </div>

                <button
                    onClick={() =>
                        handleSearch()
                    }
                >
                    Szukaj
                </button>
            </div>
        </div>
    );
};

export default AdvancedSearchHome;