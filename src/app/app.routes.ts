import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        // Lazy loads the Home component
        loadComponent: () =>
            import('./pages/home/home').then(module => module.Home)
    },
    {
        path: 'recipe',
        // Lazy loads the Recipe component
        loadComponent: () =>
            import('./pages/recipe/recipe').then(module => module.Recipe)
    },
        {
        path: 'profile',
        // Lazy loads the Profile component
        loadComponent: () =>
            import('./pages/profile/profile').then(module => module.Profile)
    }
];