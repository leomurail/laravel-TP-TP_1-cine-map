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
        return $request->user()
            ->newSubscription('default', 'price_premium_api') // Placeholder price ID
            ->checkout([
                'success_url' => route('subscription.success'),
                'cancel_url' => route('subscription.index'),
            ]);
    }

    public function success()
    {
        return redirect()->route('dashboard')->with('success', 'You are now subscribed to the Premium API!');
    }
}
