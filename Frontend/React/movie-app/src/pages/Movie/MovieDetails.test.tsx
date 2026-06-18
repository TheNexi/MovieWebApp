import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MovieDetails from './MovieDetails';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../../services/movie/movieApi', () => ({
  getFirstMovies: vi.fn(),
}));

import { getFirstMovies } from '../../services/movie/movieApi';
const getFirstMoviesMock = vi.mocked(getFirstMovies);

const fakeMovies = [
  { id: 1, title: 'Matrix', posterUrl: '/p1.jpg' },
  { id: 2, title: 'Inception', posterUrl: '/p2.jpg' },
];

describe('MovieDetails (React)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getFirstMoviesMock.mockResolvedValue({ data: fakeMovies } as any);
  });

  it('renderuje nagłówek i stan początkowy "Gotowe do pomiaru"', () => {
    render(<MovieDetails />);

    expect(
      screen.getByRole('heading', { name: 'DOM Tests' })
    ).toBeInTheDocument();
    expect(screen.getByText('Gotowe do pomiaru')).toBeInTheDocument();
    expect(screen.getByText('Brak aktywnego pomiaru')).toBeInTheDocument();
  });

  it('renderuje przycisk dla każdego limitu z tablicy LIMITS', () => {
    render(<MovieDetails />);

    [10, 100, 1000, 2500, 5000, 10000].forEach((limit) => {
      expect(
        screen.getByRole('button', { name: String(limit) })
      ).toBeInTheDocument();
    });
  });

  it('przełącza tryb na "JSON + Render UI" i podświetla aktywny przycisk', () => {
    render(<MovieDetails />);

    const renderBtn = screen.getByRole('button', { name: 'JSON + Render UI' });
    fireEvent.click(renderBtn);

    expect(renderBtn).toHaveClass('active');
    expect(
      screen.queryByText('Tryb JSON — renderowanie wyłączone')
    ).not.toBeInTheDocument();
  });

  it('po kliknięciu limitu woła API i wyświetla zmierzony czas (tryb JSON)', async () => {
    render(<MovieDetails />);

    fireEvent.click(screen.getByRole('button', { name: '100' }));

    expect(getFirstMoviesMock).toHaveBeenCalledWith(100);

    expect(await screen.findByText('100 filmów')).toBeInTheDocument();
    expect(screen.getByText('JSON')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText(/ms$/)).toBeInTheDocument()
    );
  });

  it('przenosi poprzedni pomiar do historii przy kolejnym pomiarze', async () => {
    render(<MovieDetails />);

    fireEvent.click(screen.getByRole('button', { name: '10' }));
    await screen.findByText('10 filmów');

    fireEvent.click(screen.getByRole('button', { name: '100' }));
    await screen.findByText('100 filmów');

    await waitFor(() =>
      expect(screen.getByText('1 wpisów')).toBeInTheDocument()
    );
  });

  it('czyści historię i bieżący pomiar po kliknięciu "Wyczyść historię"', async () => {
    render(<MovieDetails />);

    fireEvent.click(screen.getByRole('button', { name: '10' }));
    await screen.findByText('10 filmów');

    fireEvent.click(screen.getByRole('button', { name: 'Wyczyść historię' }));

    expect(screen.getByText('Brak aktywnego pomiaru')).toBeInTheDocument();
    expect(screen.getByText('Brak historii')).toBeInTheDocument();
  });
});
