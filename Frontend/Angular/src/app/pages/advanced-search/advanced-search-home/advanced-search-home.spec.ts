import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { of } from 'rxjs';

import { AdvancedSearchHome } from './advanced-search-home';
import { AdvancedSearchService } from '../../../services/advanced-search/advanced-search.service';

const routerMock = { navigate: vi.fn() };
const searchServiceMock = { searchMovies: vi.fn() };

const fakeMovies = [
  { id: 1, title: 'Star Wars' },
  { id: 2, title: 'Star Trek' },
  { id: 3, title: 'Stardust' },
  { id: 4, title: 'Starship' },
  { id: 5, title: 'Starman' },
  { id: 6, title: 'Star Sixth' },
];

describe('AdvancedSearchHome (Angular)', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    searchServiceMock.searchMovies.mockReturnValue(of(fakeMovies));

    await TestBed.configureTestingModule({
      imports: [AdvancedSearchHome],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AdvancedSearchService, useValue: searchServiceMock },
      ],
    }).compileComponents();
  });

  it('tworzy komponent i ustawia tytuł strony w ngOnInit', () => {
    const fixture = TestBed.createComponent(AdvancedSearchHome);
    fixture.detectChanges();

    const title = TestBed.inject(Title);
    expect(fixture.componentInstance).toBeTruthy();
    expect(title.getTitle()).toBe('Wyszukiwarka Filmów - Strona Główna');
  });

  it('po wpisaniu frazy (debounce 300 ms) pobiera i ogranicza podpowiedzi do 5', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(AdvancedSearchHome);
    fixture.detectChanges();
    const cmp = fixture.componentInstance;

    cmp.searchControl.setValue('Star');
    vi.advanceTimersByTime(300);

    expect(searchServiceMock.searchMovies).toHaveBeenCalledWith('Star');
    expect(cmp.suggestions.length).toBe(5);
    expect(cmp.showSuggestions).toBe(true);
    vi.useRealTimers();
  });

  it('renderuje listę podpowiedzi w DOM gdy showSuggestions=true', () => {
    const fixture = TestBed.createComponent(AdvancedSearchHome);
    const cmp = fixture.componentInstance;

    cmp.suggestions = fakeMovies.slice(0, 5) as any;
    cmp.showSuggestions = true;
    fixture.detectChanges();

    const items = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '.search-suggestions li'
    );
    expect(items.length).toBe(5);
    expect(items[0].textContent?.trim()).toBe('Star Wars');
  });

  it('pusta fraza chowa podpowiedzi', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(AdvancedSearchHome);
    fixture.detectChanges();
    const cmp = fixture.componentInstance;

    cmp.searchControl.setValue('   ');
    vi.advanceTimersByTime(300);

    expect(cmp.showSuggestions).toBe(false);
    vi.useRealTimers();
  });

  it('handleSearch nawiguje z parametrem zapytania', () => {
    const fixture = TestBed.createComponent(AdvancedSearchHome);
    fixture.detectChanges();

    fixture.componentInstance.handleSearch('Matrix');

    expect(routerMock.navigate).toHaveBeenCalledWith(
      ['/advanced-search/results'],
      { queryParams: { q: 'Matrix' } }
    );
  });

  it('handleSearch ignoruje pustą frazę', () => {
    const fixture = TestBed.createComponent(AdvancedSearchHome);
    fixture.detectChanges();

    fixture.componentInstance.handleSearch('   ');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('selectSuggestion ustawia kontrolkę i nawiguje', () => {
    const fixture = TestBed.createComponent(AdvancedSearchHome);
    fixture.detectChanges();
    const cmp = fixture.componentInstance;

    cmp.selectSuggestion('Inception');

    expect(cmp.searchControl.value).toBe('Inception');
    expect(routerMock.navigate).toHaveBeenCalledWith(
      ['/advanced-search/results'],
      { queryParams: { q: 'Inception' } }
    );
  });

  it('onBlur chowa podpowiedzi po 200 ms', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(AdvancedSearchHome);
    fixture.detectChanges();
    const cmp = fixture.componentInstance;

    cmp.showSuggestions = true;
    cmp.onBlur();
    expect(cmp.showSuggestions).toBe(true);

    vi.advanceTimersByTime(200);
    expect(cmp.showSuggestions).toBe(false);
    vi.useRealTimers();
  });
});
