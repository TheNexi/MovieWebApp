import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import {
  Subject,
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  of
} from 'rxjs';

import {
  AdvancedSearchService,
  MovieProduct
} from '../../../services/advanced-search/advanced-search.service';

@Component({
  selector: 'app-advanced-search-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './advanced-search-home.html',
  styleUrls: ['./advanced-search-home.scss']
})
export class AdvancedSearchHome implements OnInit, OnDestroy {

  searchControl = new FormControl('');
  suggestions: MovieProduct[] = [];
  showSuggestions = false;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private titleService: Title,
    private metaService: Meta,
    private searchService: AdvancedSearchService
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Wyszukiwarka Filmów - Strona Główna');

    this.metaService.updateTag({
      name: 'description',
      content:
        'Główna strona zaawansowanej wyszukiwarki filmów. Znajdź swój ulubiony film w Angularze.'
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$),

      switchMap(value => {
        const phrase = (value ?? '').trim();

        if (!phrase) {
          this.showSuggestions = false;
          return of([]);
        }

        return this.searchService.searchMovies(phrase);
      })
    ).subscribe(data => {
      this.suggestions = data.slice(0, 5);

      const phrase = (this.searchControl.value ?? '').trim();

      this.showSuggestions =
        phrase.length > 0 && this.suggestions.length > 0;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFocus() {
    if (this.suggestions.length > 0) {
      this.showSuggestions = true;
    }
  }

  onBlur() {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  selectSuggestion(title: string) {
    this.searchControl.setValue(title);
    this.handleSearch(title);
  }

  handleSearch(query?: string) {
    const finalQuery = (query ?? this.searchControl.value)?.trim();

    if (finalQuery) {
      this.router.navigate(['/advanced-search/results'], {
        queryParams: { q: finalQuery }
      });
    }
  }
}