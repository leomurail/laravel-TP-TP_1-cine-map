import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import LocationController from '@/actions/App/Http/Controllers/LocationController';
import type { Auth } from '@/types';

interface Film {
    id: number;
    title: string;
}

interface User {
    id: number;
    name: string;
}

interface Location {
    id: number;
    name: string;
    city: string;
    country: string;
    user_id: number;
    film: Film;
    user: User;
}

interface Props {
    locations: Location[];
}

export default function Index({ locations }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const canEdit = (location: Location) => {
        return auth.user.is_admin || auth.user.id === location.user_id;
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Emplacements', href: LocationController.index().url }]}>
            <Head title="Emplacements" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Emplacements de tournage</h1>
                    <Button asChild>
                        <Link href={LocationController.create().url}>Ajouter un emplacement</Link>
                    </Button>
                </div>

                <div className="bg-white dark:bg-neutral-900 shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
                        <thead className="bg-neutral-50 dark:bg-neutral-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Nom</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Film</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Ville</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Créé par</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {locations.map((loc) => (
                                <tr key={loc.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{loc.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{loc.film.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{loc.city}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{loc.user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Link href={LocationController.show(loc.id).url} className="text-blue-600 hover:text-blue-900">Voir</Link>
                                        {canEdit(loc) && (
                                            <>
                                                <Link href={LocationController.edit(loc.id).url} className="text-indigo-600 hover:text-indigo-900">Modifier</Link>
                                                <Link 
                                                    href={LocationController.destroy(loc.id).url} 
                                                    method="delete" 
                                                    as="button" 
                                                    className="text-red-600 hover:text-red-900"
                                                    onClick={() => confirm('Êtes-vous sûr ?')}
                                                >
                                                    Supprimer
                                                </Link>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {locations.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-neutral-500">Aucun emplacement trouvé.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
