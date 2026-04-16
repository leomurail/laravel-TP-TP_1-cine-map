import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import LocationController from '@/actions/App/Http/Controllers/LocationController';
import type { Auth } from '@/types';

interface User {
    id: number;
    name: string;
}

interface Film {
    id: number;
    title: string;
}

interface Location {
    id: number;
    name: string;
    city: string;
    country: string;
    description: string;
    upvotes_count: number;
    user_id: number;
    user: User;
    film: Film;
}

interface Props {
    location: Location;
}

export default function Show({ location }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const canEdit = auth.user.is_admin || auth.user.id === location.user_id;

    return (
        <AppLayout breadcrumbs={[{ title: 'Emplacements', href: LocationController.index().url }, { title: location.name, href: LocationController.show(location.id).url }]}>
            <Head title={location.name} />
            <div className="p-6">
                <div className="bg-white dark:bg-neutral-900 shadow rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-1">{location.name}</h1>
                            <p className="text-xl text-neutral-500">{location.city}, {location.country}</p>
                        </div>
                        {canEdit && (
                            <Link href={LocationController.edit(location.id).url} className="text-indigo-600 hover:text-indigo-900 font-medium">Modifier</Link>
                        )}
                    </div>

                    <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 mt-4">
                        <p className="text-neutral-600 dark:text-neutral-400 italic mb-2">Film associé :</p>
                        <p className="text-xl font-semibold mb-4">{location.film.title}</p>
                        
                        <p className="text-neutral-600 dark:text-neutral-400 italic mb-2">Description du lieu :</p>
                        <p className="text-lg leading-relaxed mb-6">{location.description}</p>

                        <div className="flex justify-between items-center p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                            <div>
                                <p className="text-xs text-neutral-500 uppercase">Proposé par</p>
                                <p className="font-bold">{location.user.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-neutral-500 uppercase">Popularité</p>
                                <p className="font-bold text-2xl">{location.upvotes_count} upvotes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
