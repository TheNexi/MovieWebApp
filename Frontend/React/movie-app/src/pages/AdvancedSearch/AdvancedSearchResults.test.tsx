import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdvancedSearchResults from './AdvancedSearchResults';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('react-virtuoso', () => ({
  Virtuoso: ({ data, itemContent }: any) => (
    <div data-testid="virtuoso">
      {data.map((item: any, i: number) => (
        <div key={i}>{itemContent(i, item)}</div>
      ))}
    </div>
  ),
}));

const fakeMovies = [
  { id: 1, title: 'Star Wars', averageRating: 8, durationMinutes: 120 },
  { id: 2, title: 'Star Trek', averageRating: 7, durationMinutes: 130 },
  { id: 3, title: 'Matrix', averageRating: 9, durationMinutes: 136 },
];

const renderWithRoute = (initial = '/results?q=') =>
  render(
    <MemoryRouter initialEntries={[initial]}>
      <AdvancedSearchResults />
    </MemoryRouter>
  );

describe('AdvancedSearchResults (React)', () => {
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

  it('pokazuje stan ładowania, a potem liczbę znalezionych rekordów', async () => {
    renderWithRoute();

    expect(screen.getByText('Ładowanie filmów...')).toBeInTheDocument();

    expect(
      await screen.findByText(/Znaleziono rekordów:/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Znaleziono rekordów:\s*3/)).toBeInTheDocument();
  });

  it('renderuje wszystkie filmy z danymi (tytuł, ocena, czas)', async () => {
    renderWithRoute();

    expect(await screen.findByText('Star Wars')).toBeInTheDocument();
    expect(screen.getByText('Ocena: 9/10')).toBeInTheDocument();
    expect(screen.getByText('136 min')).toBeInTheDocument();
  });

  it('filtruje wyniki po wpisaniu frazy (z debounce)', async () => {
    renderWithRoute();
    await screen.findByText('Matrix');

    const input = screen.getByPlaceholderText('Wyszukaj film...');
    fireEvent.change(input, { target: { value: 'Star' } });

    await waitFor(() =>
      expect(screen.getByText(/Znaleziono rekordów:\s*2/)).toBeInTheDocument()
    );
    expect(screen.queryByText('Matrix')).not.toBeInTheDocument();
  });

  it('inicjalizuje pole input z parametru ?q= z URL', async () => {
    renderWithRoute('/results?q=Matrix');

    const input = screen.getByPlaceholderText(
      'Wyszukaj film...'
    ) as HTMLInputElement;
    expect(input.value).toBe('Matrix');

    await waitFor(() =>
      expect(screen.getByText(/Znaleziono rekordów:\s*1/)).toBeInTheDocument()
    );
  });

  it('nawiguje do strony filmu po kliknięciu wiersza', async () => {
    renderWithRoute();
    const row = await screen.findByText('Star Wars');

    fireEvent.click(row);
    expect(mockNavigate).toHaveBeenCalledWith('/movie-page/1');
  });

  it('pokazuje "Brak wyników" gdy filtr nic nie zwraca', async () => {
    renderWithRoute();
    await screen.findByText('Matrix');

    const input = screen.getByPlaceholderText('Wyszukaj film...');
    fireEvent.change(input, { target: { value: 'xxxxxxx' } });

    expect(await screen.findByText('Brak wyników')).toBeInTheDocument();
  });
});
