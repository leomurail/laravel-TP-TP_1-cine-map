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

    return (
        <>
            <Head title="Ajouter un film" />
            <div className="mx-auto max-w-2xl p-6">
                <h1 className="mb-6 text-2xl font-bold">
                    Ajouter un nouveau film
                </h1>

                <form
                    onSubmit={submit}
                    className="space-y-4 rounded-lg bg-white p-6 shadow dark:bg-neutral-900"
                >
                    <div>
                        <Label htmlFor="title">Titre</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="release_year">Année de sortie</Label>
                        <Input
                            id="release_year"
                            type="number"
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
                            <p className="mt-1 text-sm text-red-500">
                                {errors.release_year}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="synopsis">Synopsis</Label>
                        <textarea
                            id="synopsis"
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            value={data.synopsis}
                            onChange={(e) =>
                                setData('synopsis', e.target.value)
                            }
                            required
                        />
                        {errors.synopsis && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.synopsis}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-end">
                        <Button disabled={processing}>Créer le film</Button>
                    </div>
                </form>
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
