import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getMovieById } from "../../services/movie/movieApi";
import ReviewForm from "./components/ReviewForm";
import type { Movie } from "../../services/movie/movieTypes";
import "./movie-page.css";

const MoviePage = () => {
  const { id } = useParams<{ id: string }>();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMovie = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const res = await getMovieById(Number(id));
      setMovie(res.data);
    } catch (e) {
      console.log("GET MOVIE ERROR:", e);
      setError("Nie udało się pobrać filmu");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMovie();
  }, [fetchMovie]);

  if (!id || loading || error || !movie) {
    return (
      <div className="movie-state">
        {error || (loading ? "Ładowanie..." : "Brak filmu")}
      </div>
    );
  }

  return (
    <div className="movie-page">

      <div className="movie-hero">

        <img
          src={`http://localhost:8080${movie.posterUrl}`}
          alt={movie.title}
          className="movie-poster"
        />

        <div className="movie-details">

          <h1 className="movie-title">{movie.title}</h1>

          <div className="movie-badges">
            <span className="badge">⭐ {movie.averageRating ?? "—"}</span>
            <span className="badge">
              {movie.durationMinutes ? `${movie.durationMinutes} min` : "—"}
            </span>
            <span className="badge">
              {movie.releaseDate
                ? new Date(movie.releaseDate).getFullYear()
                : "—"}
            </span>
          </div>

          <p className="movie-description">
            {movie.description || "Brak opisu filmu"}
          </p>

        </div>
      </div>

      <div className="movie-info-box">
        <div className="info-row">
          <span className="label">Gatunki</span>
          <span className="value">
            {movie.genres?.length ? movie.genres.join(", ") : "brak danych"}
          </span>
        </div>

        <div className="info-row">
          <span className="label">Aktorzy</span>
          <span className="value">
            {movie.actors?.length ? movie.actors.join(", ") : "brak danych"}
          </span>
        </div>

        <div className="info-row">
          <span className="label">Reżyserzy</span>
          <span className="value">
            {movie.directors?.length ? movie.directors.join(", ") : "brak danych"}
          </span>
        </div>

      </div>

      <div className="movie-reviews">
        <h2>Recenzje</h2>

        <ReviewForm
          movieId={movie.id}
          onReviewAdded={fetchMovie}
        />

        <div className="reviews-list">

          {movie.reviews?.length ? (
            movie.reviews.map((r: any) => (
              <div key={r.id} className="review-item">

                <div className="review-user">
                  👤 {r.user?.username ?? "unknown"}
                </div>

                <div className="review-content">
                  {r.content}
                </div>

                <div className="review-date">
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString()
                    : ""}
                </div>

              </div>
            ))
          ) : (
            <p>Brak recenzji</p>
          )}

        </div>

      </div>

    </div>
  );
};

export default MoviePage;