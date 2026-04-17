import { Head, Link, usePage } from '@inertiajs/react';
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
                <div className="mb-6 rounded-lg bg-white p-6 shadow dark:bg-neutral-900">
                    <h1 className="mb-2 text-3xl font-bold">
                        {film.title} ({film.release_year})
                    </h1>
                    <p className="mb-4 text-neutral-600 italic dark:text-neutral-400">
                        Synopsis :
                    </p>
                    <p className="text-lg leading-relaxed">{film.synopsis}</p>
                </div>

                <h2 className="mb-4 text-2xl font-bold">
                    Emplacements de tournage ({film.locations.length})
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {film.locations.map((location) => (
                        <div
                            key={location.id}
                            className="rounded-lg border border-neutral-200 bg-white p-4 shadow dark:border-neutral-800 dark:bg-neutral-900"
                        >
                            <h3 className="mb-1 text-xl font-semibold">
                                {location.name}
                            </h3>
                            <p className="mb-2 text-sm text-neutral-500">
                                {location.city}, {location.country}
                            </p>
                            <p className="mb-3 line-clamp-3 text-sm">
                                {location.description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-neutral-400">
                                <span>Par {location.user.name}</span>
                                <span className="font-bold">
                                    {location.upvotes_count} votes
                                </span>
                            </div>
                        </div>
                    ))}
                    {film.locations.length === 0 && (
                        <p className="col-span-full text-neutral-500 italic">
                            Aucun emplacement répertorié pour ce film.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

const ShowLayout = ({ children }: { children: React.ReactNode }) => {
    const { film } = usePage<Props>().props;
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Films', href: FilmController.index().url },
                {
                    title: film.title,
                    href: FilmController.show(film.id).url,
                },
            ]}
        >
            {children}
        </AppLayout>
    );
};

Show.layout = (page: React.ReactNode) => <ShowLayout>{page}</ShowLayout>;
