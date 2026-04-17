<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

#[Signature('make:admin {email?}')]
#[Description('Créer un nouvel administrateur ou promouvoir un utilisateur existant')]
class CreateAdminUser extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email') ?? $this->ask('Email de l\'utilisateur ?');
        $user = User::where('email', $email)->first();

        if ($user) {
            $user->update(['is_admin' => true]);
            $this->info("L'utilisateur {$email} est maintenant administrateur.");

            return;
        }

        $name = $this->ask('Nom ?');
        $password = $this->secret('Mot de passe ?');

        User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'is_admin' => true,
        ]);

        $this->info("Administrateur {$email} créé avec succès !");
    }
}
