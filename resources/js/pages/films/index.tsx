import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import FilmController from '@/actions/App/Http/Controllers/FilmController';
import type { Auth } from '@/types';

interface Film {
    id: number;
    title: string;
    release_year: number;
    synopsis: string;
}

interface Props {
    films: Film[];
}

export default function Index({ films }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;

    return (
        <AppLayout breadcrumbs={[{ title: 'Films', href: FilmController.index().url }]}>
            <Head title="Films" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Liste des Films</h1>
                    {auth.user.is_admin && (
                        <Button asChild>
                            <Link href={FilmController.create().url}>Ajouter un film</Link>
                        </Button>
                    )}
                </div>

                <div className="bg-white dark:bg-neutral-900 shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
                        <thead className="bg-neutral-50 dark:bg-neutral-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Titre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Année</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {films.map((film) => (
                                <tr key={film.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{film.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{film.release_year}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Link href={FilmController.show(film.id).url} className="text-blue-600 hover:text-blue-900">Voir</Link>
                                        {auth.user.is_admin && (
                                            <>
                                                <Link href={FilmController.edit(film.id).url} className="text-indigo-600 hover:text-indigo-900">Modifier</Link>
                                                <Link 
                                                    href={FilmController.destroy(film.id).url} 
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
                            {films.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-neutral-500">Aucun film trouvé.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
