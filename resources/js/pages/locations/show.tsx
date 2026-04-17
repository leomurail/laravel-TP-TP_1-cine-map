import { Head, Link, usePage, router } from '@inertiajs/react';
import { ThumbsUp } from 'lucide-react';
import LocationController from '@/actions/App/Http/Controllers/LocationController';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
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

    const handleUpvote = () => {
        router.post(
            route('locations.upvote', location.id),
            {},
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Head title={location.name} />
            <div className="p-6">
                <div className="rounded-lg bg-white p-6 shadow dark:bg-neutral-900">
                    <div className="mb-4 flex items-start justify-between">
                        <div>
                            <h1 className="mb-1 text-3xl font-bold">
                                {location.name}
                            </h1>
                            <p className="text-xl text-neutral-500">
                                {location.city}, {location.country}
                            </p>
                        </div>
                        {canEdit && (
                            <Link
                                href={LocationController.edit(location.id).url}
                                className="font-medium text-indigo-600 hover:text-indigo-900"
                            >
                                Modifier
                            </Link>
                        )}
                    </div>

                    <div className="mt-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                        <p className="mb-2 text-neutral-600 italic dark:text-neutral-400">
                            Film associé :
                        </p>
                        <p className="mb-4 text-xl font-semibold">
                            {location.film.title}
                        </p>

                        <p className="mb-2 text-neutral-600 italic dark:text-neutral-400">
                            Description du lieu :
                        </p>
                        <p className="mb-6 text-lg leading-relaxed">
                            {location.description}
                        </p>

                        <div className="flex items-center justify-between rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800">
                            <div>
                                <p className="text-xs text-neutral-500 uppercase">
                                    Proposé par
                                </p>
                                <p className="font-bold">
                                    {location.user.name}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-2 text-right">
                                <p className="text-xs text-neutral-500 uppercase">
                                    Popularité
                                </p>
                                <div className="flex items-center gap-4">
                                    <p className="text-2xl font-bold">
                                        {location.upvotes_count} upvotes
                                    </p>
                                    <Button
                                        onClick={handleUpvote}
                                        variant="outline"
                                        className="rounded-full border-2 border-black font-black dark:border-white"
                                    >
                                        <ThumbsUp size={16} className="mr-2" />
                                        Upvote
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = (page: React.ReactNode, { location }: Props) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Emplacements', href: LocationController.index().url },
            {
                title: location.name,
                href: LocationController.show(location.id).url,
            },
        ]}
    >
        {page}
    </AppLayout>
);
