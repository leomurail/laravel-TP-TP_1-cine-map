import { Head, Link } from '@inertiajs/react';
import FilmController from '@/actions/App/Http/Controllers/FilmController';
import AppLayout from '@/layouts/app-layout';

interface User {
    id: number;
    name: string;
}

interface Location {
    id: number;
    name: string;
    city: string;
    country: string;
    description: string;
    upvotes_count: number;
    user: User;
}

interface Film {
    id: number;
    title: string;
    release_year: number;
    synopsis: string;
    locations: Location[];
}

interface Props {
    film: Film;
}

export default function Show({ film }: Props) {
    return (
        <>
            <Head title={film.title} />
            <div className="p-6">
                <div className="bg-white dark:bg-neutral-900 shadow rounded-lg p-6 mb-6">
                    <h1 className="text-3xl font-bold mb-2">{film.title} ({film.release_year})</h1>
                    <p className="text-neutral-600 dark:text-neutral-400 italic mb-4">Synopsis :</p>
                    <p className="text-lg leading-relaxed">{film.synopsis}</p>
                </div>

                <h2 className="text-2xl font-bold mb-4">Emplacements de tournage ({film.locations.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {film.locations.map((location) => (
                        <div key={location.id} className="bg-white dark:bg-neutral-900 shadow rounded-lg p-4 border border-neutral-200 dark:border-neutral-800">
                            <h3 className="text-xl font-semibold mb-1">{location.name}</h3>
                            <p className="text-sm text-neutral-500 mb-2">{location.city}, {location.country}</p>
                            <p className="text-sm line-clamp-3 mb-3">{location.description}</p>
                            <div className="flex justify-between items-center text-xs text-neutral-400">
                                <span>Par {location.user.name}</span>
                                <span className="font-bold">{location.upvotes_count} votes</span>
                            </div>
                        </div>
                    ))}
                    {film.locations.length === 0 && (
                        <p className="text-neutral-500 col-span-full italic">Aucun emplacement répertorié pour ce film.</p>
                    )}
                </div>
            </div>
        </>
    );
}

Show.layout = (page: React.ReactNode, { film }: Props) => (
    <AppLayout breadcrumbs={[{ title: 'Films', href: FilmController.index().url }, { title: film.title, href: FilmController.show(film.id).url }]}>
        {page}
    </AppLayout>
);
