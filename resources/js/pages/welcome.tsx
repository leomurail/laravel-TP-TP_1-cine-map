import { Head, Link, usePage } from '@inertiajs/react';
import FilmController from '@/actions/App/Http/Controllers/FilmController';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';
import type { Auth } from '@/types';

export default function Welcome({ canRegister = true }) {
    const { auth } = usePage<{ auth: Auth }>().props;

    return (
        <div className="min-h-screen bg-white font-sans text-neutral-950 selection:bg-rose-500 selection:text-white dark:bg-neutral-950 dark:text-neutral-50">
            <Head title="CineMap — Discover Film Locations" />

            <header className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between p-6 mix-blend-difference">
                <div className="text-xl font-black tracking-tighter text-white uppercase">
                    CineMap
                </div>
                <nav className="flex gap-8 text-sm font-medium tracking-widest text-white uppercase">
                    {auth.user ? (
                        <Link href={dashboard()}>Dashboard</Link>
                    ) : (
                        <>
                            <Link href={login()}>Log in</Link>
                            {canRegister && (
                                <Link href={register()}>Register</Link>
                            )}
                        </>
                    )}
                </nav>
            </header>

            <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
                <h1 className="text-editorial-hero mb-4 leading-[0.8] tracking-tighter">
                    Cine<span className="text-rose-600">Map</span>
                </h1>
                <p className="mb-12 max-w-xl text-xl leading-relaxed font-light text-balance text-neutral-500 md:text-2xl dark:text-neutral-400">
                    Explore legendary film locations. <br />
                    Share your discoveries with the world.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                    <Button
                        size="lg"
                        className="rounded-none px-12 py-8 text-lg font-black tracking-widest uppercase"
                        asChild
                    >
                        <Link href={FilmController.index().url}>
                            Explore Films
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="rounded-none px-12 py-8 text-lg font-black tracking-widest uppercase"
                        asChild
                    >
                        <Link href={register()}>Join Community</Link>
                    </Button>
                </div>
            </main>
        </div>
    );
}
