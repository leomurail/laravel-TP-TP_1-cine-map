import { Head, Link, usePage } from '@inertiajs/react';
import FilmController from '@/actions/App/Http/Controllers/FilmController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { Auth } from '@/types';

interface Film {
    id: number;
    title: string;
    release_year: number;
    synopsis: string;
}

import { dashboard } from '@/routes';

export default function Index({ films }: { films: Film[] }) {
    const { auth } = usePage<{ auth: Auth }>().props;

    return (
        <>
            <Head title="Catalogue de Films" />
            <div className="p-8 max-w-7xl mx-auto font-sans">
                <header className="mb-16">
                    <h1 className="text-7xl font-black uppercase mb-4 tracking-tighter">Catalogue</h1>
                    <div className="flex justify-between items-end border-b border-neutral-200 dark:border-neutral-800 pb-4">
                        <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest text-balance">Total {films.length} titres</p>
                        {auth.user.is_admin && (
                            <Button variant="outline" className="rounded-none border-2 border-black dark:border-white font-black uppercase" asChild>
                                <Link href={FilmController.create().url}>+ Ajouter</Link>
                            </Button>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
                    {films.map((film) => (
                        <div key={film.id} className="group relative flex flex-col">
                            <div className="aspect-[4/5] bg-neutral-100 dark:bg-neutral-900 mb-6 overflow-hidden transition-all group-hover:bg-neutral-200 dark:group-hover:bg-neutral-800 flex items-center justify-center">
                                <span className="text-8xl font-black text-neutral-200 dark:text-neutral-800 transition-transform group-hover:scale-110">
                                    {film.title.charAt(0)}
                                </span>
                            </div>
                            <Badge variant="secondary" className="w-fit mb-2 font-mono rounded-none">{film.release_year}</Badge>
                            <h2 className="text-3xl font-black uppercase mb-3 leading-none tracking-tight">
                                <Link href={FilmController.show(film.id).url} className="hover:text-rose-600 transition-colors text-balance">
                                    {film.title}
                                </Link>
                            </h2>
                            <p className="text-neutral-500 line-clamp-2 text-sm leading-relaxed mb-6 font-light italic text-balance">
                                {film.synopsis}
                            </p>
                            {auth.user.is_admin && (
                                <div className="mt-auto flex gap-4 border-t border-neutral-100 dark:border-neutral-900 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={FilmController.edit(film.id).url} className="text-xs uppercase font-black tracking-widest hover:text-rose-600">Éditer</Link>
                                    <Link href={FilmController.destroy(film.id).url} method="delete" as="button" className="text-xs uppercase font-black tracking-widest text-neutral-400 hover:text-red-600">Supprimer</Link>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

Index.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Catalogue', href: FilmController.index().url }]}>
        {page}
    </AppLayout>
);
