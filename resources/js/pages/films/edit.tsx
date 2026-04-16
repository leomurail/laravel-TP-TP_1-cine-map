import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FilmController from '@/actions/App/Http/Controllers/FilmController';

interface Film {
    id: number;
    title: string;
    release_year: number;
    synopsis: string;
}

interface Props {
    film: Film;
}

export default function Edit({ film }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: film.title,
        release_year: film.release_year,
        synopsis: film.synopsis,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(FilmController.update(film.id).url);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Films', href: FilmController.index().url }, { title: 'Modifier', href: FilmController.edit(film.id).url }]}>
            <Head title={`Modifier ${film.title}`} />
            <div className="p-6 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Modifier : {film.title}</h1>

                <form onSubmit={submit} className="space-y-4 bg-white dark:bg-neutral-900 p-6 shadow rounded-lg">
                    <div>
                        <Label htmlFor="title">Titre</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <Label htmlFor="release_year">Année de sortie</Label>
                        <Input
                            id="release_year"
                            type="number"
                            value={data.release_year}
                            onChange={(e) => setData('release_year', parseInt(e.target.value))}
                            required
                        />
                        {errors.release_year && <p className="text-red-500 text-sm mt-1">{errors.release_year}</p>}
                    </div>

                    <div>
                        <Label htmlFor="synopsis">Synopsis</Label>
                        <textarea
                            id="synopsis"
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            value={data.synopsis}
                            onChange={(e) => setData('synopsis', e.target.value)}
                            required
                        />
                        {errors.synopsis && <p className="text-red-500 text-sm mt-1">{errors.synopsis}</p>}
                    </div>

                    <div className="flex items-center justify-end">
                        <Button disabled={processing}>Mettre à jour</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
