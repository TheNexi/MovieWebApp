import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { of, BehaviorSubject } from 'rxjs';

import { AdvancedSearchResults } from './advanced-search-results';
import { AdvancedSearchService } from '../../../services/advanced-search/advanced-search.service';

const routerMock = { navigate: vi.fn() };
const searchServiceMock = { searchMovies: vi.fn() };

const fakeMovies = [
  {
    id: 1,
    title: 'Star Wars',
    description: '',
    averageRating: 8,
    durationMinutes: 120,
    posterUrl: '',
    releaseDate: '',
  },
  {
    id: 2,
    title: 'Matrix',
    description: '',
    averageRating: 9,
    durationMinutes: 136,
    posterUrl: '',
    releaseDate: '',
  },
];

describe('AdvancedSearchResults (Angular)', () => {
  let queryParams$: BehaviorSubject<any>;

  beforeEach(async () => {
    vi.clearAllMocks();
    queryParams$ = new BehaviorSubject<any>({ q: 'Star' });
    searchServiceMock.searchMovies.mockReturnValue(of(fakeMovies));

    await TestBed.configureTestingModule({
      imports: [AdvancedSearchResults],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AdvancedSearchService, useValue: searchServiceMock },
        { provide: ActivatedRoute, useValue: { queryParams: queryParams$ } },
      ],
    }).compileComponents();
  });

  it('na starcie czyta ?q= z URL, wykonuje wyszukiwanie i zapisuje wyniki', () => {
    const fixture = TestBed.createComponent(AdvancedSearchResults);
    fixture.detectChanges();
    const cmp = fixture.componentInstance;

    expect(searchServiceMock.searchMovies).toHaveBeenCalledWith('Star');
    expect(cmp.filterControl.value).toBe('Star');
    expect(cmp.results.length).toBe(2);
    expect(cmp.loading).toBe(false);
    expect(cmp.hasSearched).toBe(true);
  });

  it('aktualizuje tytuł strony (SEO) na podstawie zapytania', () => {
    const fixture = TestBed.createComponent(AdvancedSearchResults);
    fixture.detectChanges();

    const title = TestBed.inject(Title);
    expect(title.getTitle()).toBe('Wyniki: Star');
  });

  it('montuje wirtualny viewport CDK i wiąże dane wyników', () => {
    const fixture = TestBed.createComponent(AdvancedSearchResults);
    fixture.detectChanges();
    const cmp = fixture.componentInstance;

    const viewport = (fixture.nativeElement as HTMLElement).querySelector(
      'cdk-virtual-scroll-viewport'
    );
    expect(viewport).toBeTruthy();
    expect(cmp.results.length).toBe(2);
    expect(cmp.results[0].title).toBe('Star Wars');
  });

  it('openMovie nawiguje do strony filmu', () => {
    const fixture = TestBed.createComponent(AdvancedSearchResults);
    fixture.detectChanges();

    fixture.componentInstance.openMovie({ id: 7 } as any);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/movie-page', 7]);
  });

  it('zmiana pola filtra (debounce 300 ms) aktualizuje URL z replaceUrl', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(AdvancedSearchResults);
    fixture.detectChanges();
    routerMock.navigate.mockClear();

    fixture.componentInstance.filterControl.setValue('Matrix');
    vi.advanceTimersByTime(300);

    expect(routerMock.navigate).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        queryParams: { q: 'Matrix' },
        replaceUrl: true,
      })
    );
    vi.useRealTimers();
  });

  it('reaguje na zmianę queryParams w strumieniu i ponawia wyszukiwanie', () => {
    const fixture = TestBed.createComponent(AdvancedSearchResults);
    fixture.detectChanges();

    searchServiceMock.searchMovies.mockClear();
    queryParams$.next({ q: 'Matrix' });

    expect(searchServiceMock.searchMovies).toHaveBeenCalledWith('Matrix');
  });
});
