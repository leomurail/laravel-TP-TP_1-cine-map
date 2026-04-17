import { Head, Link, usePage } from '@inertiajs/react';
import { Clapperboard } from 'lucide-react';
import FilmController from '@/actions/App/Http/Controllers/FilmController';
import EmptyState from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { Auth } from '@/types';

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
            <div className="mx-auto max-w-7xl p-8 font-sans">
                <header className="mb-16">
                    <h1 className="mb-4 text-7xl font-black tracking-tighter uppercase">
                        Catalogue
                    </h1>
                    <div className="flex items-end justify-between border-b-2 border-black pb-4 dark:border-white">
                        <p className="font-mono text-xs tracking-widest text-neutral-500 uppercase">
                            Total {films.length} titres répertoriés
                        </p>
                        {auth.user.is_admin && (
                            <Button
                                variant="outline"
                                className="rounded-none border-2 border-black font-black uppercase dark:border-white"
                                asChild
                            >
                                <Link href={FilmController.create().url}>
                                    + Ajouter un film
                                </Link>
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
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {films.map((film) => (
                            <div
                                key={film.id}
                                className="group relative flex flex-col rounded-none border-2 border-black bg-white transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
                            >
                                <div className="flex items-center justify-between border-b-2 border-black p-3 font-mono text-[10px] font-bold uppercase dark:border-white">
                                    <span>
                                        REF: #{String(film.id).padStart(3, '0')}
                                    </span>
                                    <span>DATE: {film.release_year}</span>
                                </div>
                                <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                                    <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-10"></div>
                                    <span className="text-9xl font-black text-neutral-200 transition-transform select-none group-hover:scale-110 dark:text-neutral-800">
                                        {film.title.charAt(0)}
                                    </span>
                                </div>
                                <div className="flex flex-1 flex-col p-6">
                                    <h2 className="mb-3 text-2xl leading-none font-black tracking-tighter uppercase">
                                        <Link
                                            href={
                                                FilmController.show(film.id).url
                                            }
                                            className="transition-colors hover:text-rose-600"
                                        >
                                            {film.title}
                                        </Link>
                                    </h2>
                                    <p className="mb-6 line-clamp-2 text-sm leading-relaxed font-medium text-neutral-500 italic">
                                        {film.synopsis}
                                    </p>
                                    {auth.user.is_admin && (
                                        <div className="-mx-6 mt-auto -mb-6 flex border-t-2 border-black dark:border-white">
                                            <Link
                                                href={
                                                    FilmController.edit(film.id)
                                                        .url
                                                }
                                                className="flex-1 border-r-2 border-black py-3 text-center text-xs font-black tracking-widest uppercase transition-colors hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
                                            >
                                                Éditer
                                            </Link>
                                            <Link
                                                href={
                                                    FilmController.destroy(
                                                        film.id,
                                                    ).url
                                                }
                                                method="delete"
                                                as="button"
                                                className="flex-1 py-3 text-center text-xs font-black tracking-widest text-red-600 uppercase transition-colors hover:bg-red-600 hover:text-white"
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
    <AppLayout
        breadcrumbs={[{ title: 'Catalogue', href: FilmController.index().url }]}
    >
        {page}
    </AppLayout>
);
