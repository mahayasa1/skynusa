<?php


namespace App\Console\Commands;

use App\Models\VisitorLog;
use Illuminate\Console\Command;
use Carbon\Carbon;
use Symfony\Component\Console\Command\Command as ConsoleCommand;

class CleanOldVisitorLogs extends Command
{
    protected $signature = 'visitors:clean {--days=30 : Number of days to keep}';
    protected $description = 'Clean old visitor logs older than specified days';

    public function handle()
    {
        $days = $this->option('days');
        $date = Carbon::now()->subDays($days);

        $this->info("Deleting visitor logs older than {$days} days ({$date->toDateString()})...");

        $count = VisitorLog::where('created_at', '<', $date)->delete();

        $this->info("Deleted {$count} old visitor logs.");
        
        return ConsoleCommand::SUCCESS;
    }
}