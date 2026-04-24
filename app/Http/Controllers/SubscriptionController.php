<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('subscription/index', [
            'subscribed' => $request->user()->subscribed('default'),
        ]);
    }

    public function checkout(Request $request)
    {
        if (! config('cashier.secret')) {
            return back()->with('error', 'Stripe API keys are not configured. Please add STRIPE_KEY and STRIPE_SECRET to your .env file.');
        }

        if (config('cashier.price_id', 'price_premium_api') === 'price_premium_api') {
            // Optional: check if the price ID is still the placeholder
            // return back()->with('error', 'Please configure a valid Stripe Price ID in your controller or .env file.');
        }

        $checkout = $request->user()
            ->newSubscription('default', config('cashier.price_id', 'price_premium_api'))
            ->checkout([
                'success_url' => route('subscription.success'),
                'cancel_url' => route('subscription.index'),
            ]);

        return Inertia::location($checkout->url);
    }

    public function success()
    {
        return redirect()->route('dashboard')->with('success', 'You are now subscribed to the Premium API!');
    }
}
