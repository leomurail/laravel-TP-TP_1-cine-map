<?php

namespace App\Console\Commands;

use App\Models\Location;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CleanupLocations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:cleanup-locations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Supprime les emplacements créés depuis plus de 14 jours et qui ont moins de 2 upvotes.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = Location::where('created_at', '<=', Carbon::now()->subDays(14))
            ->where('upvotes_count', '<', 2)
            ->delete();

        $this->info("{$count} emplacements obsolètes ont été supprimés.");
    }
}
