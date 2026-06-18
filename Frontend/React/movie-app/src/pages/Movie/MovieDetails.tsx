import { useState } from "react";
import "./movie-details.css";
import { getFirstMovies } from "../../services/movie/movieApi";
import { useNavigate } from "react-router-dom";

const LIMITS = [10, 100, 1000, 2500, 5000, 10000];

type MeasureMode = "json" | "render";

interface LogEntry {
  id: string;
  limit: number;
  mode: MeasureMode;
  durationMs: number;
  durationSec: number;
  status: "success" | "error";
  timestamp: string;
}

const MovieDetails = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [current, setCurrent] = useState<LogEntry | null>(null);
  const [loadingLimit, setLoadingLimit] = useState<number | null>(null);
  const [mode, setMode] = useState<MeasureMode>("json");
  const [movies, setMovies] = useState<any[]>([]);
  const navigate = useNavigate();

  const moveCurrentToHistory = () => {
    setCurrent((prev) => {
      if (!prev) return null;

      setLogs((logs) => {
        const alreadyExists = logs[0]?.id === prev.id;
        if (alreadyExists) return logs;

        return [prev, ...logs];
      });

      return null;
    });
  };

  const clearAll = () => {
    setLogs([]);
    setMovies([]);
    setCurrent(null);
  };

  const fetchMovies = async (limit: number) => {
    moveCurrentToHistory();

    setLoadingLimit(limit);

    const start = performance.now();

    const run: LogEntry = {
      id: crypto.randomUUID(),
      limit,
      mode,
      durationMs: 0,
      durationSec: 0,
      status: "success",
      timestamp: new Date().toLocaleTimeString(),
    };

    setCurrent(run);

    if (mode === "json") {
      setMovies([]);
    }

    try {
      const response = await getFirstMovies(limit);

      const jsonTime = performance.now() - start;

      if (mode === "json") {
        setCurrent((prev) =>
          prev
            ? {
                ...prev,
                durationMs: Math.round(jsonTime),
                durationSec: Number((jsonTime / 1000).toFixed(2)),
              }
            : null
        );

        return;
      }

      const moviesWithCacheBypass = response.data.map((movie: any) => ({
        ...movie,
        posterUrl: movie.posterUrl
          ? `http://localhost:8080${movie.posterUrl}?t=${Date.now()}-${movie.id}`
          : "",
      }));

      setMovies(moviesWithCacheBypass);

      requestAnimationFrame(() => {
        const renderTime = performance.now() - start;

        setCurrent((prev) =>
          prev
            ? {
                ...prev,
                durationMs: Math.round(renderTime),
                durationSec: Number((renderTime / 1000).toFixed(2)),
              }
            : null
        );
      });
    } catch {
      const durationMs = performance.now() - start;

      setCurrent((prev) =>
        prev
          ? {
              ...prev,
              durationMs: Math.round(durationMs),
              durationSec: Number((durationMs / 1000).toFixed(2)),
              status: "error",
            }
          : null
      );
    } finally {
      setLoadingLimit(null);
    }
  };

  return (
    <section className="page">
      <div className="top-bar">
        <div>
          <h2>DOM Tests</h2>
        </div>

        <div className="status-box">
          {loadingLimit !== null
            ? `Pobieranie ${loadingLimit} filmów...`
            : "Gotowe do pomiaru"}
        </div>
      </div>

      <div className="mode-switch">
        <button
          className={`mode-button ${mode === "json" ? "active" : ""}`}
          onClick={() => {
            setMode("json");
            setMovies([]);
          }}
        >
          JSON only
        </button>

        <button
          className={`mode-button ${mode === "render" ? "active" : ""}`}
          onClick={() => {
            setMode("render");
            setMovies([]);
          }}
        >
          JSON + Render UI
        </button>

        <button className="clear-button" onClick={clearAll}>
          Wyczyść historię
        </button>
      </div>

      <div className="fetch-actions">
        {LIMITS.map((limit) => (
          <button
            key={limit}
            className={`fetch-button ${
              loadingLimit === limit ? "active" : ""
            }`}
            disabled={loadingLimit !== null}
            onClick={() => fetchMovies(limit)}
          >
            {limit}
          </button>
        ))}
      </div>

      <div className="layout">
        <div className="left-panel">
          <div className="panel current-panel">
            <div className="panel-header">
              <h3>Aktualny pomiar</h3>
            </div>

            {!current ? (
              <div className="empty-state">
                Brak aktywnego pomiaru
              </div>
            ) : (
              <div className="log-card">
                <span className={`mode-dot ${current.mode}`} />

                <div className="log-top">
                  <span className="badge">
                    {current.mode.toUpperCase()}
                  </span>

                  <span className="time">
                    {current.timestamp}
                  </span>
                </div>

                <div className="log-main">
                  {current.limit} filmów
                </div>

                <div className="metrics">
                  <div className="metric">
                    <span className="label">Milisekundy</span>
                    <strong>{current.durationMs} ms</strong>
                  </div>

                  <div className="metric">
                    <span className="label">Sekundy</span>
                    <strong>{current.durationSec} s</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="panel history-panel">
            <div className="panel-header">
              <h3>Historia pomiarów</h3>
              <span>{logs.length} wpisów</span>
            </div>

            <div className="history-scroll">
              {logs.length === 0 ? (
                <div className="empty-state">
                  Brak historii
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="log-card">
                    <span className={`mode-dot ${log.mode}`} />

                    <div className="log-top">
                      <span className="badge">
                        {log.mode.toUpperCase()}
                      </span>

                      <span className="time">
                        {log.timestamp}
                      </span>
                    </div>

                    <div className="log-main">
                      {log.limit} filmów
                    </div>

                    <div className="metrics">
                      <div className="metric">
                        <span className="label">
                          Milisekundy
                        </span>

                        <strong>{log.durationMs} ms</strong>
                      </div>

                      <div className="metric">
                        <span className="label">
                          Sekundy
                        </span>

                        <strong>{log.durationSec} s</strong>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="panel movies-panel">
          <div className="panel-header">
            <h3>Wyniki renderowania</h3>
            <span>{movies.length} filmów</span>
          </div>

          {mode === "json" ? (
            <div className="empty-state">
              Tryb JSON — renderowanie wyłączone
            </div>
          ) : movies.length === 0 ? (
            <div className="empty-state">
              Brak danych
            </div>
          ) : (
            <div className="poster-scroll">

              <div className="poster-grid">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="poster-card"
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="grid-poster"
                      loading="eager"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MovieDetails;