import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, tap } from 'rxjs';

import {
  AdvancedSearchService,
  MovieProduct
} from '../../../services/advanced-search/advanced-search.service';
import { Movie } from '../../../services/movie/movie-types';

@Component({
  selector: 'app-advanced-search-results',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ScrollingModule, RouterModule],
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

        this.filterControl.setValue(query, { emitEvent: false });

        this.updateSEO(query);
        this.triggerSearch(query);
      })
    ).subscribe();

    this.filterControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { q: value ?? '' },
        replaceUrl: true
      });
    });
  }

openMovie(movie: Movie) {
  this.router.navigate(['/movie-page', movie.id]);
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
        console.error(err);
        this.loading = false;
        this.hasSearched = true;
        this.cdr.markForCheck();
      }
    });
  }

  private updateSEO(query: string) {
    this.titleService.setTitle(`Wyniki: ${query || 'wszystko'}`);
    this.metaService.updateTag({
      name: 'description',
      content: `Wyniki wyszukiwania`
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}