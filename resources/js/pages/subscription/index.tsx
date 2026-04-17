import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import SubscriptionController from '@/actions/App/Http/Controllers/SubscriptionController';

export default function Index({ subscribed }: { subscribed: boolean }) {
    const { post, processing } = useForm();

    const handleSubscribe = () => {
        post(SubscriptionController.checkout().url);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Subscription', href: SubscriptionController.index().url }]}>
            <Head title="Subscription" />
            
            <div className="flex items-center justify-center min-h-[60vh] p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold">Premium API</CardTitle>
                        <CardDescription>Get full access to our film locations database via JSON API.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center justify-center py-4">
                            <span className="text-5xl font-extrabold">€9</span>
                            <span className="text-muted-foreground ml-1">/month</span>
                        </div>
                        <ul className="grid gap-2 text-sm">
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                Full JSON API Access
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                JWT Authentication
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                Unlimited Requests
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        {subscribed ? (
                            <Button className="w-full" disabled>
                                Already Subscribed
                            </Button>
                        ) : (
                            <Button 
                                className="w-full" 
                                size="lg" 
                                onClick={handleSubscribe}
                                disabled={processing}
                            >
                                {processing ? 'Redirecting to Stripe...' : 'Subscribe Now'}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}
