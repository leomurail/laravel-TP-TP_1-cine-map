import { Head, useForm, usePage } from '@inertiajs/react';
import LocationController from '@/actions/App/Http/Controllers/LocationController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';

interface Film {
    id: number;
    title: string;
}

interface Location {
    id: number;
    film_id: number;
    name: string;
    city: string;
    country: string;
    description: string;
}

interface Props {
    location: Location;
    films: Film[];
}

export default function Edit({ location, films }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        film_id: location.film_id,
        name: location.name,
        city: location.city,
        country: location.country,
        description: location.description,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(LocationController.update(location.id).url);
    };

    const inputClasses = "rounded-none border-2 border-black focus:border-rose-600 focus:ring-0 dark:border-white dark:bg-black dark:focus:border-rose-500 transition-colors";
    const labelClasses = "font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block";

    return (
        <>
            <Head title={`Modifier ${location.name}`} />
            <div className="mx-auto max-w-4xl p-8">
                <div className="border-2 border-black dark:border-white bg-white dark:bg-black rounded-none overflow-hidden">
                    <header className="bg-neutral-100 dark:bg-neutral-900 border-b-2 border-black dark:border-white p-6">
                        <h1 className="text-2xl font-black uppercase tracking-tighter">
                            Modifier / {location.name}
                        </h1>
                    </header>

                    <form onSubmit={submit} className="p-8 space-y-8">
                        <div>
                            <Label htmlFor="film_id" className={labelClasses}>Film Associé</Label>
                            <select
                                id="film_id"
                                className={`flex h-12 w-full bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${inputClasses}`}
                                value={data.film_id}
                                onChange={(e) =>
                                    setData('film_id', parseInt(e.target.value))
                                }
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
                                <p className="mt-2 text-xs font-mono font-bold text-red-600 uppercase">
                                    Error: {errors.film_id}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="name" className={labelClasses}>Nom de l'Emplacement</Label>
                            <Input
                                id="name"
                                className={inputClasses}
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && (
                                <p className="mt-2 text-xs font-mono font-bold text-red-600 uppercase">
                                    Error: {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <Label htmlFor="city" className={labelClasses}>Ville</Label>
                                <Input
                                    id="city"
                                    className={inputClasses}
                                    value={data.city}
                                    onChange={(e) =>
                                        setData('city', e.target.value)
                                    }
                                    required
                                />
                                {errors.city && (
                                    <p className="mt-2 text-xs font-mono font-bold text-red-600 uppercase">
                                        Error: {errors.city}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="country" className={labelClasses}>Pays</Label>
                                <Input
                                    id="country"
                                    className={inputClasses}
                                    value={data.country}
                                    onChange={(e) =>
                                        setData('country', e.target.value)
                                    }
                                    required
                                />
                                {errors.country && (
                                    <p className="mt-2 text-xs font-mono font-bold text-red-600 uppercase">
                                        Error: {errors.country}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="description" className={labelClasses}>Description / Notes</Label>
                            <textarea
                                id="description"
                                className={`flex min-h-[120px] w-full bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${inputClasses}`}
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                required
                            />
                            {errors.description && (
                                <p className="mt-2 text-xs font-mono font-bold text-red-600 uppercase">
                                    Error: {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="pt-4 border-t-2 border-black dark:border-white -mx-8 -mb-8">
                            <Button 
                                disabled={processing} 
                                className="w-full h-16 rounded-none bg-black hover:bg-rose-600 text-white dark:bg-white dark:text-black dark:hover:bg-rose-500 font-black text-xl uppercase transition-colors"
                            >
                                Mettre à jour
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

const EditLayout = ({ children }: { children: React.ReactNode }) => {
    const { location } = usePage<Props>().props;
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Emplacements', href: LocationController.index().url },
                {
                    title: 'Modifier',
                    href: LocationController.edit(location.id).url,
                },
            ]}
        >
            {children}
        </AppLayout>
    );
};

Edit.layout = (page: React.ReactNode) => <EditLayout>{page}</EditLayout>;
