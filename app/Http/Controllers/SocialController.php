<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialController extends Controller
{
    public function redirectToProvider($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    public function handleProviderCallback($provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->user();

            // 1. Try to find user by social ID
            $user = User::where("{$provider}_id", $socialUser->id)->first();

            if (!$user) {
                // 2. Try to find user by email
                $user = User::where('email', $socialUser->getEmail())->first();

                if ($user) {
                    // Link social ID to existing account
                    $user->update([
                        "{$provider}_id" => $socialUser->id,
                        "{$provider}_nickname" => $socialUser->getNickname(),
                        "{$provider}_token" => $socialUser->token,
                    ]);
                } else {
                    // 3. Create new user
                    $user = User::create([
                        'name' => $socialUser->getName() ?? $socialUser->getNickname(),
                        'email' => $socialUser->getEmail(),
                        "{$provider}_id" => $socialUser->id,
                        "{$provider}_nickname" => $socialUser->getNickname(),
                        "{$provider}_token" => $socialUser->token,
                        'email_verified_at' => now(),
                    ]);
                }
            } else {
                // Update token if user found by social ID
                $user->update([
                    "{$provider}_token" => $socialUser->token,
                ]);
            }

            Auth::login($user);

            return redirect()->intended('/dashboard');
        } catch (\Exception $e) {
            return redirect('/login')->with('error', 'Authentication failed: ' . $e->getMessage());
        }
    }
}
