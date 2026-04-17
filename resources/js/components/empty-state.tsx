import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel: string;
    actionHref: string;
    icon: LucideIcon;
}

export default function EmptyState({ title, description, actionLabel, actionHref, icon: Icon }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 dark:border-neutral-700 p-12 py-24 text-center rounded-none">
            <div className="bg-neutral-100 dark:bg-neutral-900 p-6 mb-6">
                <Icon size={48} className="text-neutral-400" />
            </div>
            <h3 className="text-3xl font-black uppercase mb-2 tracking-tighter">{title}</h3>
            <p className="text-neutral-500 font-mono text-xs uppercase mb-8 max-w-sm">{description}</p>
            <Button variant="outline" className="rounded-none border-2 border-black dark:border-white font-black uppercase h-12 px-8" asChild>
                <Link href={actionHref}>+ {actionLabel}</Link>
            </Button>
        </div>
    );
}
