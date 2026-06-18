import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdvancedSearchHome from './AdvancedSearchHome';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const fakeMovies = [
  { id: 1, title: 'Star Wars' },
  { id: 2, title: 'Star Trek' },
  { id: 3, title: 'Matrix' },
];

describe('AdvancedSearchHome (React)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: () => Promise.resolve(fakeMovies),
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renderuje nagłówek, pole wyszukiwania i przycisk', () => {
    render(<AdvancedSearchHome />);

    expect(
      screen.getByRole('heading', {
        name: 'Zaawansowana Wyszukiwarka Filmów',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Wpisz nazwę filmu...')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Szukaj' })).toBeInTheDocument();
  });

  it('ustawia tytuł dokumentu i meta description (SEO) w useEffect', async () => {
    render(<AdvancedSearchHome />);

    await waitFor(() =>
      expect(document.title).toBe('Wyszukiwarka Filmów - Strona Główna')
    );
    const meta = document.querySelector('meta[name="description"]');
    expect(meta?.getAttribute('content')).toContain(
      'zaawansowanej wyszukiwarki filmów'
    );
  });

  it('pobiera filmy z API przy montażu', async () => {
    render(<AdvancedSearchHome />);

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/movies/first/10000'
      )
    );
  });

  it('po wpisaniu frazy (debounce) pokazuje pasujące podpowiedzi', async () => {
    render(<AdvancedSearchHome />);

    await waitFor(() => expect(fetch).toHaveBeenCalled());

    const input = screen.getByPlaceholderText('Wpisz nazwę filmu...');
    fireEvent.change(input, { target: { value: 'Star' } });

    expect(await screen.findByText('Star Wars')).toBeInTheDocument();
    expect(screen.getByText('Star Trek')).toBeInTheDocument();
    expect(screen.queryByText('Matrix')).not.toBeInTheDocument();
  });

  it('nawiguje do wyników po kliknięciu "Szukaj"', async () => {
    render(<AdvancedSearchHome />);

    const input = screen.getByPlaceholderText('Wpisz nazwę filmu...');
    fireEvent.change(input, { target: { value: 'Matrix' } });
    fireEvent.click(screen.getByRole('button', { name: 'Szukaj' }));

    expect(mockNavigate).toHaveBeenCalledWith(
      '/advanced-search/results?q=Matrix'
    );
  });

  it('nawiguje po naciśnięciu Enter w polu input', async () => {
    render(<AdvancedSearchHome />);

    const input = screen.getByPlaceholderText('Wpisz nazwę filmu...');
    fireEvent.change(input, { target: { value: 'Inception' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockNavigate).toHaveBeenCalledWith(
      '/advanced-search/results?q=Inception'
    );
  });

  it('nie nawiguje gdy fraza jest pusta', () => {
    render(<AdvancedSearchHome />);

    fireEvent.click(screen.getByRole('button', { name: 'Szukaj' }));
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
