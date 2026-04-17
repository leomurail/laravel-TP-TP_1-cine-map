import { Head, useForm } from '@inertiajs/react';
import FilmController from '@/actions/App/Http/Controllers/FilmController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        release_year: new Date().getFullYear(),
        synopsis: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(FilmController.store().url);
    };

    const inputClasses = "rounded-none border-2 border-black focus:border-rose-600 focus:ring-0 dark:border-white dark:bg-black dark:focus:border-rose-500 transition-colors";
    const labelClasses = "font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block";

    return (
        <>
            <Head title="Ajouter un film" />
            <div className="mx-auto max-w-4xl p-8">
                <div className="border-2 border-black dark:border-white bg-white dark:bg-black rounded-none overflow-hidden">
                    <header className="bg-neutral-100 dark:bg-neutral-900 border-b-2 border-black dark:border-white p-6">
                        <h1 className="text-2xl font-black uppercase tracking-tighter">
                            Nouveau Film / Fiche Technique
                        </h1>
                    </header>

                    <form onSubmit={submit} className="p-8 space-y-8">
                        <div>
                            <Label htmlFor="title" className={labelClasses}>Titre du Film</Label>
                            <Input
                                id="title"
                                className={inputClasses}
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                            />
                            {errors.title && (
                                <p className="mt-2 text-xs font-mono font-bold text-red-600 uppercase">
                                    Error: {errors.title}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="release_year" className={labelClasses}>Année de Sortie</Label>
                            <Input
                                id="release_year"
                                type="number"
                                className={inputClasses}
                                value={data.release_year}
                                onChange={(e) =>
                                    setData(
                                        'release_year',
                                        parseInt(e.target.value),
                                    )
                                }
                                required
                            />
                            {errors.release_year && (
                                <p className="mt-2 text-xs font-mono font-bold text-red-600 uppercase">
                                    Error: {errors.release_year}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="synopsis" className={labelClasses}>Synopsis / Résumé</Label>
                            <textarea
                                id="synopsis"
                                className={`flex min-h-[150px] w-full bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${inputClasses}`}
                                value={data.synopsis}
                                onChange={(e) =>
                                    setData('synopsis', e.target.value)
                                }
                                required
                            />
                            {errors.synopsis && (
                                <p className="mt-2 text-xs font-mono font-bold text-red-600 uppercase">
                                    Error: {errors.synopsis}
                                </p>
                            )}
                        </div>

                        <div className="pt-4 border-t-2 border-black dark:border-white -mx-8 -mb-8">
                            <Button 
                                disabled={processing} 
                                className="w-full h-16 rounded-none bg-black hover:bg-rose-600 text-white dark:bg-white dark:text-black dark:hover:bg-rose-500 font-black text-xl uppercase transition-colors"
                            >
                                Enregistrer le Titre
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

Create.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Films', href: FilmController.index().url },
            { title: 'Ajouter', href: FilmController.create().url },
        ]}
    >
        {page}
    </AppLayout>
);
