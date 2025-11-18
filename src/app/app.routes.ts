import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'profile',
        // Lazy loads the Profile component
        loadComponent: () =>
            import('./pages/profile/profile').then(module => module.Profile)
    }
];