# Amélioration du Design Back-Office Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Améliorer le design des pages d'index des Films et des Lieux pour adopter un style "Catalogue Industriel" brutaliste et ajouter des états vides (empty states) structurés.

**Architecture:** Refonte des composants React (Inertia) pour utiliser des bordures marquées, des polices mono pour les métadonnées, et une structure de grille/liste plus rigoureuse. Création d'un composant `EmptyState` partagé.

**Tech Stack:** React, Tailwind CSS, Lucide React, Inertia.js.

---

### Task 1: Création du composant EmptyState Brutaliste

**Files:**
- Create: `resources/js/components/empty-state.tsx`

- [ ] **Step 1: Implémenter le composant EmptyState**

```tsx
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel: string;
    actionHref: string;
    icon: LucideIcon;
}

export default function EmptyState({ title, description, actionLabel, actionHref, icon: Icon }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 dark:border-neutral-700 p-12 py-24 text-center rounded-none">
            <div className="bg-neutral-100 dark:bg-neutral-900 p-6 mb-6">
                <Icon size={48} className="text-neutral-400" />
            </div>
            <h3 className="text-3xl font-black uppercase mb-2 tracking-tighter">{title}</h3>
            <p className="text-neutral-500 font-mono text-xs uppercase mb-8 max-w-sm">{description}</p>
            <Button variant="outline" className="rounded-none border-2 border-black dark:border-white font-black uppercase h-12 px-8" asChild>
                <Link href={actionHref}>+ {actionLabel}</Link>
            </Button>
        </div>
    );
}
```

- [ ] **Step 2: Vérifier que le fichier est créé sans erreurs de compilation**

- [ ] **Step 3: Commit**

```bash
git add resources/js/components/empty-state.tsx
git commit -m "feat: add brutalist EmptyState component"
```

### Task 2: Refonte de la page Index des Films

**Files:**
- Modify: `resources/js/pages/films/index.tsx`

- [ ] **Step 1: Implémenter le nouveau design de grille et l'EmptyState**

```tsx
import { Head, Link, usePage } from '@inertiajs/react';
import FilmController from '@/actions/App/Http/Controllers/FilmController';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { Auth } from '@/types';
import EmptyState from '@/components/empty-state';
import { Clapperboard } from 'lucide-react';

interface Film {
    id: number;
    title: string;
    release_year: number;
    synopsis: string;
}

export default function Index({ films }: { films: Film[] }) {
    const { auth } = usePage<{ auth: Auth }>().props;

    return (
        <>
            <Head title="Catalogue de Films" />
            <div className="p-8 max-w-7xl mx-auto font-sans">
                <header className="mb-16">
                    <h1 className="text-7xl font-black uppercase mb-4 tracking-tighter">Catalogue</h1>
                    <div className="flex justify-between items-end border-b-2 border-black dark:border-white pb-4">
                        <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">Total {films.length} titres répertoriés</p>
                        {auth.user.is_admin && (
                            <Button variant="outline" className="rounded-none border-2 border-black dark:border-white font-black uppercase" asChild>
                                <Link href={FilmController.create().url}>+ Ajouter un film</Link>
                            </Button>
                        )}
                    </div>
                </header>

                {films.length === 0 ? (
                    <EmptyState 
                        title="Archive Vide"
                        description="Aucun titre n'est actuellement répertorié dans le catalogue industriel."
                        actionLabel="Ajouter un film"
                        actionHref={FilmController.create().url}
                        icon={Clapperboard}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {films.map((film) => (
                            <div key={film.id} className="group relative flex flex-col border-2 border-black dark:border-white rounded-none bg-white dark:bg-black transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                                <div className="flex justify-between items-center p-3 border-b-2 border-black dark:border-white font-mono text-[10px] uppercase font-bold">
                                    <span>REF: #{String(film.id).padStart(3, '0')}</span>
                                    <span>DATE: {film.release_year}</span>
                                </div>
                                <div className="aspect-[16/9] bg-neutral-100 dark:bg-neutral-900 overflow-hidden flex items-center justify-center relative">
                                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
                                    <span className="text-9xl font-black text-neutral-200 dark:text-neutral-800 transition-transform group-hover:scale-110 select-none">
                                        {film.title.charAt(0)}
                                    </span>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h2 className="text-2xl font-black uppercase mb-3 leading-none tracking-tighter">
                                        <Link href={FilmController.show(film.id).url} className="hover:text-rose-600 transition-colors">
                                            {film.title}
                                        </Link>
                                    </h2>
                                    <p className="text-neutral-500 line-clamp-2 text-sm leading-relaxed mb-6 font-medium italic">
                                        {film.synopsis}
                                    </p>
                                    {auth.user.is_admin && (
                                        <div className="mt-auto flex border-t-2 border-black dark:border-white -mx-6 -mb-6">
                                            <Link 
                                                href={FilmController.edit(film.id).url} 
                                                className="flex-1 py-3 text-center text-xs uppercase font-black tracking-widest border-r-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                                            >
                                                Éditer
                                            </Link>
                                            <Link 
                                                href={FilmController.destroy(film.id).url} 
                                                method="delete" 
                                                as="button" 
                                                className="flex-1 py-3 text-center text-xs uppercase font-black tracking-widest text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                                            >
                                                Supprimer
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

Index.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Catalogue', href: FilmController.index().url }]}>
        {page}
    </AppLayout>
);
```

- [ ] **Step 2: Commit**

```bash
git add resources/js/pages/films/index.tsx
git commit -m "style: refactor films index to industrial catalogue design"
```

### Task 3: Refonte de la page Index des Lieux

**Files:**
- Modify: `resources/js/pages/locations/index.tsx`

- [ ] **Step 1: Implémenter le nouveau design de registre et l'EmptyState**

```tsx
import { Head, Link, usePage, router } from '@inertiajs/react';
import { MapPin, ThumbsUp, Map } from 'lucide-react';
import LocationController from '@/actions/App/Http/Controllers/LocationController';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { Auth } from '@/types';
import EmptyState from '@/components/empty-state';

interface Location {
    id: number;
    name: string;
    city: string;
    country: string;
    user_id: number;
    upvotes_count: number;
    film: { id: number; title: string };
    user: { name: string };
}

export default function Index({ locations }: { locations: Location[] }) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const handleUpvote = (id: number) => {
        router.post(LocationController.upvote(id).url, {}, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Exploration des lieux" />
            <div className="p-8 max-w-7xl mx-auto font-sans">
                <header className="mb-16">
                    <h1 className="text-7xl font-black uppercase mb-4 tracking-tighter">Lieux</h1>
                    <div className="flex justify-between items-end border-b-2 border-black dark:border-white pb-4">
                        <p className="text-neutral-500 font-mono uppercase tracking-widest text-xs">Film Location Registry / Global Database</p>
                        <Button variant="outline" className="rounded-none border-2 border-black dark:border-white font-black uppercase" asChild>
                            <Link href={LocationController.create().url}>+ Partager un lieu</Link>
                        </Button>
                    </div>
                </header>

                {locations.length === 0 ? (
                    <EmptyState 
                        title="Zéro Emplacement"
                        description="Aucun emplacement n'est actuellement répertorié. En attente de partage par la communauté."
                        actionLabel="Partager un lieu"
                        actionHref={LocationController.create().url}
                        icon={Map}
                    />
                ) : (
                    <div className="flex flex-col border-t-2 border-black dark:border-white">
                        {locations.map((loc) => (
                            <div key={loc.id} className="group flex flex-col md:flex-row items-stretch border-b-2 border-black dark:border-white hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors">
                                <div className="w-full md:w-64 p-6 border-r-2 border-black dark:border-white flex flex-col justify-center bg-neutral-100 dark:bg-neutral-900 group-hover:bg-rose-50 dark:group-hover:bg-rose-950/20 transition-colors">
                                    <span className="text-[10px] font-mono uppercase text-neutral-500 mb-1">Film Reference</span>
                                    <p className="text-rose-600 font-black text-sm uppercase tracking-tighter leading-tight">{loc.film.title}</p>
                                </div>
                                
                                <div className="flex-1 p-6 flex flex-col justify-center">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2 text-neutral-900 dark:text-neutral-100">
                                        <Link href={LocationController.show(loc.id).url} className="hover:text-rose-600 transition-colors">
                                            {loc.name}
                                        </Link>
                                    </h2>
                                    <div className="flex items-center gap-2 text-neutral-500 font-mono text-[10px] uppercase tracking-widest">
                                        <MapPin size={12} className="text-black dark:text-white" />
                                        <span>{loc.city}, {loc.country}</span>
                                        <span className="ml-auto text-neutral-400">Added by {loc.user.name}</span>
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col border-l-0 md:border-l-2 border-black dark:border-white divide-x-2 md:divide-x-0 md:divide-y-2 divide-black dark:divide-white">
                                    <button 
                                        onClick={() => handleUpvote(loc.id)}
                                        className="flex-1 flex items-center justify-center gap-2 p-6 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                                    >
                                        <ThumbsUp size={18} />
                                        <span className="font-black text-xl">{loc.upvotes_count}</span>
                                    </button>
                                    
                                    {(auth.user.is_admin || auth.user.id === loc.user_id) && (
                                        <Link 
                                            href={LocationController.edit(loc.id).url} 
                                            className="flex-1 flex items-center justify-center p-6 text-xs uppercase font-black tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                                        >
                                            Edit
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

Index.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Lieux', href: LocationController.index().url }]}>
        {page}
    </AppLayout>
);
```

- [ ] **Step 2: Commit**

```bash
git add resources/js/pages/locations/index.tsx
git commit -m "style: refactor locations index to production registry design"
```

### Task 4: Vérification Finale

- [ ] **Step 1: Vérifier le rendu visuel (simuler des listes vides et pleines)**
- [ ] **Step 2: S'assurer que les liens et actions (upvote, edit, delete) fonctionnent toujours**
