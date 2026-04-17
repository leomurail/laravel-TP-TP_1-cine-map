import { Head, useForm } from '@inertiajs/react';
import LocationController from '@/actions/App/Http/Controllers/LocationController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';

interface Film {
    id: number;
    title: string;
}

interface Props {
    films: Film[];
}

export default function Create({ films }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        film_id: '',
        name: '',
        city: '',
        country: '',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(LocationController.store().url);
    };

    return (
        <>
            <Head title="Ajouter un emplacement" />
            <div className="mx-auto max-w-2xl p-6">
                <h1 className="mb-6 text-2xl font-bold">
                    Nouvel emplacement de tournage
                </h1>

                <form
                    onSubmit={submit}
                    className="space-y-4 rounded-lg bg-white p-6 shadow dark:bg-neutral-900"
                >
                    <div>
                        <Label htmlFor="film_id">Film</Label>
                        <select
                            id="film_id"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            value={data.film_id}
                            onChange={(e) => setData('film_id', e.target.value)}
                            required
                        >
                            <option value="">Sélectionnez un film</option>
                            {films.map((film) => (
                                <option key={film.id} value={film.id}>
                                    {film.title}
                                </option>
                            ))}
                        </select>
                        {errors.film_id && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.film_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="name">Nom du lieu</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="city">Ville</Label>
                            <Input
                                id="city"
                                value={data.city}
                                onChange={(e) =>
                                    setData('city', e.target.value)
                                }
                                required
                            />
                            {errors.city && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.city}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="country">Pays</Label>
                            <Input
                                id="country"
                                value={data.country}
                                onChange={(e) =>
                                    setData('country', e.target.value)
                                }
                                required
                            />
                            {errors.country && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.country}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            required
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-end">
                        <Button disabled={processing}>
                            Créer l'emplacement
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

Create.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Emplacements', href: LocationController.index().url },
            { title: 'Ajouter', href: LocationController.create().url },
        ]}
    >
        {page}
    </AppLayout>
);
