import { Head, Link, usePage } from '@inertiajs/react';
import FilmController from '@/actions/App/Http/Controllers/FilmController';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';
import type { Auth } from '@/types';

export default function Welcome({ canRegister = true }) {
    const { auth } = usePage<{ auth: Auth }>().props;

    return (
        <div className="min-h-screen bg-white text-neutral-950 selection:bg-rose-500 selection:text-white dark:bg-neutral-950 dark:text-neutral-50 font-sans">
            <Head title="CineMap — Discover Film Locations" />
            
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 mix-blend-difference">
                <div className="text-xl font-black tracking-tighter uppercase text-white">CineMap</div>
                <nav className="flex gap-8 text-sm font-medium text-white uppercase tracking-widest">
                    {auth.user ? (
                        <Link href={dashboard()}>Dashboard</Link>
                    ) : (
                        <>
                            <Link href={login()}>Log in</Link>
                            {canRegister && <Link href={register()}>Register</Link>}
                        </>
                    )}
                </nav>
            </header>

            <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
                <h1 className="text-editorial-hero mb-4 leading-[0.8] tracking-tighter">
                    Cine<span className="text-rose-600">Map</span>
                </h1>
                <p className="max-w-xl text-xl md:text-2xl font-light text-neutral-500 dark:text-neutral-400 mb-12 leading-relaxed text-balance">
                    Explore legendary film locations. <br />
                    Share your discoveries with the world.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="rounded-none px-12 py-8 text-lg uppercase font-black tracking-widest" asChild>
                        <Link href={FilmController.index().url}>Explore Films</Link>
                    </Button>
                    <Button variant="outline" size="lg" className="rounded-none px-12 py-8 text-lg uppercase font-black tracking-widest" asChild>
                        <Link href={register()}>Join Community</Link>
                    </Button>
                </div>
            </main>
        </div>
    );
}
