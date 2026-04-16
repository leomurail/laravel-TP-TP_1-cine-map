import { Head, Link, usePage } from '@inertiajs/react';
import { MapPin } from 'lucide-react';
import LocationController from '@/actions/App/Http/Controllers/LocationController';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { Auth } from '@/types';

interface Location {
    id: number;
    name: string;
    city: string;
    country: string;
    user_id: number;
    film: { id: number; title: string };
    user: { name: string };
}

export default function Index({ locations }: { locations: Location[] }) {
    const { auth } = usePage<{ auth: Auth }>().props;

    return (
        <AppLayout breadcrumbs={[{ title: 'Lieux', href: LocationController.index().url }]}>
            <Head title="Exploration des lieux" />
            <div className="p-8 max-w-7xl mx-auto font-sans">
                <header className="mb-16">
                    <h1 className="text-7xl font-black uppercase mb-4 tracking-tighter">Lieux</h1>
                    <div className="flex justify-between items-end border-b border-neutral-200 dark:border-neutral-800 pb-4">
                        <p className="text-neutral-500 font-mono uppercase tracking-widest text-xs">Film Location Registry</p>
                        <Button variant="outline" className="rounded-none border-2 border-black dark:border-white font-black uppercase" asChild>
                            <Link href={LocationController.create().url}>+ Partager</Link>
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
                    {locations.map((loc) => (
                        <div key={loc.id} className="group flex flex-col md:flex-row gap-8 items-start border-l-4 border-transparent hover:border-rose-600 pl-6 transition-all">
                            <div className="flex-1">
                                <p className="text-rose-600 font-black text-xs uppercase tracking-tighter mb-2 text-balance">{loc.film.title}</p>
                                <h2 className="text-4xl font-black uppercase tracking-tight leading-none mb-4 text-balance text-neutral-900 dark:text-neutral-100">
                                    <Link href={LocationController.show(loc.id).url}>{loc.name}</Link>
                                </h2>
                                <div className="flex items-center gap-2 text-neutral-400 font-mono text-xs uppercase tracking-widest mb-6">
                                    <MapPin size={14} />
                                    <span>{loc.city}, {loc.country}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-mono uppercase text-neutral-500 border-t border-neutral-100 dark:border-neutral-900 pt-4">
                                    <span>Added by {loc.user.name}</span>
                                    {(auth.user.is_admin || auth.user.id === loc.user_id) && (
                                        <div className="flex gap-4">
                                            <Link href={LocationController.edit(loc.id).url} className="text-black dark:text-white font-black hover:text-rose-600 transition-colors">Edit</Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
