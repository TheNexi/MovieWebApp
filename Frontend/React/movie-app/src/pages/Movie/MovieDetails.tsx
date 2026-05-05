import { useState } from "react";
import "../../styles/page.css";
import { getFirstMovies } from "../../services/movie/movieApi";

const LIMITS = [10, 100, 1000, 2500, 5000, 10000];

const MovieDetails = () => {
  const [logs, setLogs] = useState<string[]>(["Gotowe"]);
  const [loadingLimit, setLoadingLimit] = useState<number | null>(null);
  const addLog = (message: string) => setLogs((prev) => [...prev, message]);

  const fetchMovies = async (limit: number) => {
    setLoadingLimit(limit);
    addLog(`Pobieranie ${limit} filmów...`);

    const start = performance.now();
    try {
      const response = await getFirstMovies(limit);
      const durationMs = performance.now() - start;
      const durationSec = durationMs / 1000;
      addLog(
        `Pobrano ${response.data.length} filmów w ${durationMs.toFixed(0)} ms (${durationSec.toFixed(2)} s, status ${response.status}).`
      );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      const durationMs = performance.now() - start;
      const durationSec = durationMs / 1000;
      addLog(`Pobieranie nie powiodło się po ${durationMs.toFixed(0)} ms (${durationSec.toFixed(2)} s).`);
    } finally {
      setLoadingLimit(null);
    }
  };

  return (
    <div className="page">
      <h2>Movie Details</h2>
      <div className="fetch-actions">
        {LIMITS.map((limit) => (
          <button
            key={limit}
            type="button"
            onClick={() => fetchMovies(limit)}
            disabled={loadingLimit !== null}
            className="fetch-button"
          >
            Pobierz pierwsze {limit}
          </button>
        ))}
      </div>
      <ul className="fetch-log">
        {logs.map((entry, index) => (
          <li key={`${entry}-${index}`}>{entry}</li>
        ))}
      </ul>
    </div>
  );
};

export default MovieDetails;