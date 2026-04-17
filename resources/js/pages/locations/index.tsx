import { Head, Link, usePage, router } from '@inertiajs/react';
import { MapPin, ThumbsUp, Map } from 'lucide-react';
import LocationController from '@/actions/App/Http/Controllers/LocationController';
import EmptyState from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { Auth } from '@/types';

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
        router.post(
            LocationController.upvote(id).url,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Head title="Exploration des lieux" />
            <div className="mx-auto max-w-7xl p-8 font-sans">
                <header className="mb-16">
                    <h1 className="mb-4 text-7xl font-black tracking-tighter uppercase">
                        Lieux
                    </h1>
                    <div className="flex items-end justify-between border-b-2 border-black pb-4 dark:border-white">
                        <p className="font-mono text-xs tracking-widest text-neutral-500 uppercase">
                            Film Location Registry / Global Database
                        </p>
                        <Button
                            variant="outline"
                            className="rounded-none border-2 border-black font-black uppercase dark:border-white"
                            asChild
                        >
                            <Link href={LocationController.create().url}>
                                + Partager un lieu
                            </Link>
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
                            <div
                                key={loc.id}
                                className="group flex flex-col items-stretch border-b-2 border-black transition-colors hover:bg-neutral-50 md:flex-row dark:border-white dark:hover:bg-neutral-950"
                            >
                                <div className="flex w-full flex-col justify-center border-r-2 border-black bg-neutral-100 p-6 transition-colors group-hover:bg-rose-50 md:w-64 dark:border-white dark:bg-neutral-900 dark:group-hover:bg-rose-950/20">
                                    <span className="mb-1 font-mono text-[10px] text-neutral-500 uppercase">
                                        Film Reference
                                    </span>
                                    <p className="text-sm leading-tight font-black tracking-tighter text-rose-600 uppercase">
                                        {loc.film.title}
                                    </p>
                                </div>

                                <div className="flex flex-1 flex-col justify-center p-6">
                                    <h2 className="mb-2 text-3xl leading-none font-black tracking-tighter text-neutral-900 uppercase dark:text-neutral-100">
                                        <Link
                                            href={
                                                LocationController.show(loc.id)
                                                    .url
                                            }
                                            className="transition-colors hover:text-rose-600"
                                        >
                                            {loc.name}
                                        </Link>
                                    </h2>
                                    <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
                                        <MapPin
                                            size={12}
                                            className="text-black dark:text-white"
                                        />
                                        <span>
                                            {loc.city}, {loc.country}
                                        </span>
                                        <span className="ml-auto text-neutral-400">
                                            Added by {loc.user.name}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-row divide-x-2 divide-black border-l-0 border-black md:flex-col md:divide-x-0 md:divide-y-2 md:border-l-2 dark:divide-white dark:border-white">
                                    <button
                                        onClick={() => handleUpvote(loc.id)}
                                        className="flex flex-1 items-center justify-center gap-2 p-6 transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                                    >
                                        <ThumbsUp size={18} />
                                        <span className="text-xl font-black">
                                            {loc.upvotes_count}
                                        </span>
                                    </button>

                                    {(auth.user.is_admin ||
                                        auth.user.id === loc.user_id) && (
                                        <Link
                                            href={
                                                LocationController.edit(loc.id)
                                                    .url
                                            }
                                            className="flex flex-1 items-center justify-center p-6 text-xs font-black tracking-widest uppercase transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
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
    <AppLayout
        breadcrumbs={[{ title: 'Lieux', href: LocationController.index().url }]}
    >
        {page}
    </AppLayout>
);
