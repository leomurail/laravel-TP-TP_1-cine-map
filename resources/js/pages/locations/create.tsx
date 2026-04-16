import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LocationController from '@/actions/App/Http/Controllers/LocationController';

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
        <AppLayout breadcrumbs={[{ title: 'Emplacements', href: LocationController.index().url }, { title: 'Ajouter', href: LocationController.create().url }]}>
            <Head title="Ajouter un emplacement" />
            <div className="p-6 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Nouvel emplacement de tournage</h1>

                <form onSubmit={submit} className="space-y-4 bg-white dark:bg-neutral-900 p-6 shadow rounded-lg">
                    <div>
                        <Label htmlFor="film_id">Film</Label>
                        <select
                            id="film_id"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            value={data.film_id}
                            onChange={(e) => setData('film_id', e.target.value)}
                            required
                        >
                            <option value="">Sélectionnez un film</option>
                            {films.map((film) => (
                                <option key={film.id} value={film.id}>{film.title}</option>
                            ))}
                        </select>
                        {errors.film_id && <p className="text-red-500 text-sm mt-1">{errors.film_id}</p>}
                    </div>

                    <div>
                        <Label htmlFor="name">Nom du lieu</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="city">Ville</Label>
                            <Input
                                id="city"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                required
                            />
                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                        </div>
                        <div>
                            <Label htmlFor="country">Pays</Label>
                            <Input
                                id="country"
                                value={data.country}
                                onChange={(e) => setData('country', e.target.value)}
                                required
                            />
                            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            required
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    <div className="flex items-center justify-end">
                        <Button disabled={processing}>Créer l'emplacement</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
