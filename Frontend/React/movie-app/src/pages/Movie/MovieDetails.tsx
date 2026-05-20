import { useState } from "react";
import "../../styles/page.css";
import { getFirstMovies } from "../../services/movie/movieApi";

const LIMITS = [10, 100, 1000, 2500, 5000, 10000];

type MeasureMode = "json" | "render";

interface LogEntry {
  id: number;
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

  const flushCurrent = () => {
    setCurrent((prev) => {
      if (prev) setLogs((l) => [prev, ...l]);
      return null;
    });
  };

  const fetchMovies = async (limit: number) => {
    flushCurrent();

    setLoadingLimit(limit);

    const start = performance.now();

    const run: LogEntry = {
      id: Date.now(),
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
      const res = await getFirstMovies(limit);

      const durationMs = performance.now() - start;

      setCurrent((prev) =>
        prev
          ? {
              ...prev,
              durationMs: Math.round(durationMs),
              durationSec: Number((durationMs / 1000).toFixed(2)),
              status: "success",
            }
          : null
      );

      if (mode === "render") {
        setMovies(res.data);

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
      }
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
    <div className="page">

      <div className="top-bar">
        <div>
          <h2>DOM Tests</h2>
        </div>

        <div className="mode-switch">
          <button
            className={`mode-button ${mode === "json" ? "active" : ""}`}
            onClick={() => setMode("json")}
          >
            JSON only
          </button>

          <button
            className={`mode-button ${mode === "render" ? "active" : ""}`}
            onClick={() => setMode("render")}
          >
            JSON + Render Ui
          </button>

          <button
            className="clear-button"
            onClick={() => {
              setLogs([]);
              setMovies([]);
              setCurrent(null);
            }}
          >
            Wyczyść historię
          </button>
        </div>
      </div>

      <div className="fetch-actions">
        {LIMITS.map((limit) => (
          <button
            key={limit}
            onClick={() => fetchMovies(limit)}
            disabled={loadingLimit !== null}
            className={`fetch-button ${loadingLimit === limit ? "active" : ""}`}
          >
            {limit}
          </button>
        ))}
      </div>

      <div className="layout">
        <div className="left-panel">
          <div className="panel current-panel">
            <h3>Aktualny pomiar</h3>

            {current ? (
              <div className="log-card">
                <span className={`mode-dot ${current.mode}`} />

                <div className="log-top">
                  <span className="badge">{current.mode.toUpperCase()}</span>
                  <span className="time">{current.timestamp}</span>
                </div>

                <div className="log-main">{current.limit} filmów</div>

                <div className="metrics">
                  <div className="metric">
                    <span className="label">ms</span>
                    <strong>{current.durationMs}</strong>
                  </div>
                  <div className="metric">
                    <span className="label">s</span>
                    <strong>{current.durationSec}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="json-mode">Brak aktywnego pomiaru</div>
            )}
          </div>

          <div className="panel history-panel">
            <div className="panel-header">
              <h3>Historia pomiarów</h3>
              <span>{logs.length}</span>
            </div>

            <div className="history-scroll">
              {logs.length === 0 ? (
                <div className="empty-state">Brak danych</div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="log-card">
                    <span className={`mode-dot ${log.mode}`} />

                    <div className="log-top">
                      <span className="badge">{log.mode.toUpperCase()}</span>
                      <span className="time">{log.timestamp}</span>
                    </div>

                    <div className="log-main">{log.limit} filmów</div>

                    <div className="metrics">
                      <div className="metric">
                        <span className="label">ms</span>
                        <strong>{log.durationMs}</strong>
                      </div>
                      <div className="metric">
                        <span className="label">s</span>
                        <strong>{log.durationSec}</strong>
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
            <h3>Wyniki</h3>
            <span>{movies.length}</span>
          </div>

          {mode !== "render" ? (
            <div className="empty-state">Tryb JSON – brak renderu</div>
          ) : movies.length === 0 ? (
            <div className="empty-state">Brak filmów</div>
          ) : (
            <div className="history-scroll">

              {movies.map((movie) => (
                <div key={movie.id} className="movie-row">

                  <img
                    className="poster"
                    src={
                      movie.posterUrl
                        ? `http://localhost:8080${movie.posterUrl}`
                        : "https://via.placeholder.com/80x120"
                    }
                    alt={movie.title}
                    width={80}
                    height={120}
                  />

                  <div className="movie-content">
                    <h3>{movie.title}</h3>
                    <p>{movie.description}</p>
                    <small>{movie.releaseDate}</small>
                  </div>

                </div>
              ))}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;