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
