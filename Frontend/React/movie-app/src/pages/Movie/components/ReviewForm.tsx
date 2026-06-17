import { useState } from "react";
import { addReviewToMovie } from "../../../services/movie/movieApi";
import type { ReviewRequest } from "../../../services/movie/movieTypes";
import "./review-form.css";

interface ReviewFormProps {
  movieId: number;
  onReviewAdded?: () => void;
}

const ReviewForm = ({ movieId, onReviewAdded }: ReviewFormProps) => {
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (value: string) => {
    if (!value.trim()) return "Treść recenzji nie może być pusta.";
    if (value.trim().length < 5) return "Recenzja jest za krótka (min. 5 znaków).";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validate(content);

    setError(null);
    setSuccess(false);

    if (validationError) {
      setError(validationError);
      return;
    }

    const payload: ReviewRequest = {
      content: content.trim(),
    };

    try {
      setIsSubmitting(true);

      await addReviewToMovie(movieId, payload);

      setContent("");
      setUsername("");
      setIsAnonymous(false);
      setSuccess(true);

      onReviewAdded?.();

      setTimeout(() => setSuccess(false), 2500);
    } catch (err: any) {
      setError(
        err?.response?.data ?? "Wystąpił błąd podczas dodawania recenzji."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-form-container">
      <h3>Napisz recenzję</h3>

      <form onSubmit={handleSubmit} className="review-form">

        {/* CONTENT */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Podziel się swoimi wrażeniami..."
          rows={4}
          disabled={isSubmitting}
          className={error ? "input-error" : ""}
        />

        {/* USERNAME INPUT (optional) */}
        {!isAnonymous && (
          <input
            type="text"
            placeholder="Twoja nazwa (opcjonalnie)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
          />
        )}

        {/* ANONYMOUS CHECKBOX */}
        <label className="anon-box">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          Napisz jako anonim
        </label>

        {error && <div className="error-message">⚠ {error}</div>}

        {success && (
          <div className="success-message">
            ✔ Recenzja została opublikowana!
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !!validate(content)}
        >
          {isSubmitting ? "Wysyłanie..." : "Dodaj recenzję"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;