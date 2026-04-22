import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'login' },
	{
		path: 'login',
		loadComponent: () => import('./pages/auth/login/login').then((m) => m.Login),
	},
	{
		path: 'register',
		loadComponent: () => import('./pages/auth/register/register').then((m) => m.Register),
	},
	{
		path: 'home',
		canActivate: [authGuard],
		loadComponent: () => import('./pages/home/home/home').then((m) => m.Home),
	},
	{
		path: 'movie/:id',
		canActivate: [authGuard],
		loadComponent: () => import('./pages/movie/movie-details/movie-details').then((m) => m.MovieDetails),
	},
	{
		path: 'favourites',
		canActivate: [authGuard],
		loadComponent: () => import('./pages/user/favourites/favourites').then((m) => m.Favourites),
	},
	{
		path: 'profile',
		canActivate: [authGuard],
		loadComponent: () => import('./pages/user/profile/profile').then((m) => m.Profile),
	},
	{ path: '**', redirectTo: 'login' },
];
