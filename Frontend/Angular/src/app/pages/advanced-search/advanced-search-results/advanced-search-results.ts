import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  Subject,
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  of,
  tap
} from 'rxjs';

import { AdvancedSearchService, MovieProduct } from '../../../services/advanced-search/advanced-search.service';

@Component({
  selector: 'app-advanced-search-results',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ScrollingModule],
  templateUrl: './advanced-search-results.html',
  styleUrls: ['./advanced-search-results.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvancedSearchResults implements OnInit, OnDestroy {

  filterControl = new FormControl('');
  results: MovieProduct[] = [];
  loading = false;
  hasSearched = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: AdvancedSearchService,
    private titleService: Title,
    private metaService: Meta,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.pipe(
      takeUntil(this.destroy$),
      tap(params => {
        const query = params['q'] || '';

        if (this.filterControl.value !== query) {
          this.filterControl.setValue(query, { emitEvent: false });
        }

        this.updateSEO(query);
        this.triggerSearch(query);
      })
    ).subscribe();

    this.filterControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      const query = value ?? '';

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { q: query },
        replaceUrl: true
      });
    });
  }

  private triggerSearch(query: string) {

    this.loading = true;
    this.hasSearched = false;
    this.cdr.markForCheck();

    this.searchService.searchMovies(query).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.results = data;
        this.loading = false;
        this.hasSearched = true;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Błąd podczas pobierania danych', err);
        this.loading = false;
        this.hasSearched = true;
        this.cdr.markForCheck();
      }
    });
  }

  private updateSEO(query: string) {
    this.titleService.setTitle(
      `Wyniki wyszukiwania: ${query || 'wszystko'}`
    );

    this.metaService.updateTag({
      name: 'description',
      content: `Zobacz wyniki wyszukiwania dla frazy: ${query || 'wszystko'}`
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}