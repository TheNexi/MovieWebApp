import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';

import { MovieDetails } from './movie-details';
import { MovieApiService } from '../../../services/movie/movie-api.service';

const movieApiMock = {
  getFirstMovies: vi.fn(),
};

describe('MovieDetails (Angular)', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    movieApiMock.getFirstMovies.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [MovieDetails],
      providers: [
        { provide: MovieApiService, useValue: movieApiMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id: '42' }) },
          },
        },
      ],
    }).compileComponents();
  });

  function createComponent() {
    const fixture = TestBed.createComponent(MovieDetails);
    fixture.detectChanges();
    return fixture;
  }

  it('tworzy komponent i czyta id filmu z ActivatedRoute', () => {
    const fixture = createComponent();
    const cmp = fixture.componentInstance as any;
    expect(cmp).toBeTruthy();
    expect(cmp.movieId).toBe('42');
  });

  it('renderuje przyciski dla wszystkich limitów', () => {
    const fixture = createComponent();
    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '.fetch-button'
    );
    expect(buttons.length).toBe(6);
  });

  it('setMode("render") zmienia tryb, czyści filmy i aktualizuje status', () => {
    const fixture = createComponent();
    const cmp = fixture.componentInstance as any;

    cmp.movies = [{ id: 1 }];
    cmp.setMode('render');

    expect(cmp.measureMode).toBe('render');
    expect(cmp.movies).toEqual([]);
    expect(cmp.currentStatus).toBe('Tryb: Full DOM render');
  });

  it('fetchMovies w trybie JSON woła API i zapisuje pomiar sukcesu', () => {
    movieApiMock.getFirstMovies.mockReturnValue(of([{ id: 1 }, { id: 2 }]));
    const fixture = createComponent();
    const cmp = fixture.componentInstance as any;

    cmp.fetchMovies(100);

    expect(movieApiMock.getFirstMovies).toHaveBeenCalledWith(100);
    expect(cmp.currentRun.limit).toBe(100);
    expect(cmp.currentRun.status).toBe('success');
    expect(cmp.currentStatus).toBe('JSON: 2 rekordów');
    expect(cmp.loadingLimit).toBeNull();
  });

  it('przenosi poprzedni pomiar do historii przy kolejnym fetchu', () => {
    const fixture = createComponent();
    const cmp = fixture.componentInstance as any;

    cmp.fetchMovies(10);
    const first = cmp.currentRun;
    cmp.fetchMovies(100);

    expect(cmp.logs.length).toBe(1);
    expect(cmp.logs[0]).toBe(first);
  });

  it('obsługuje błąd API bez wyjątku i resetuje loadingLimit (finalize)', () => {
    movieApiMock.getFirstMovies.mockReturnValue(
      throwError(() => new Error('network'))
    );
    const fixture = createComponent();
    const cmp = fixture.componentInstance as any;

    expect(() => cmp.fetchMovies(1000)).not.toThrow();
    expect(cmp.currentRun).not.toBeNull();
    expect(cmp.loadingLimit).toBeNull();
  });

  it('clearLogs czyści historię i bieżący pomiar', () => {
    const fixture = createComponent();
    const cmp = fixture.componentInstance as any;

    cmp.fetchMovies(10);
    cmp.fetchMovies(100);
    cmp.clearLogs();

    expect(cmp.logs).toEqual([]);
    expect(cmp.currentRun).toBeNull();
  });

  it('trackById zwraca id filmu', () => {
    const fixture = createComponent();
    const cmp = fixture.componentInstance as any;
    expect(cmp.trackById(0, { id: 7 })).toBe(7);
  });
});
