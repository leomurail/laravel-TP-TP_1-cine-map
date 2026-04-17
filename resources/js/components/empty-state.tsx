import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel: string;
    actionHref: string;
    icon: LucideIcon;
}

export default function EmptyState({
    title,
    description,
    actionLabel,
    actionHref,
    icon: Icon,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-none border-2 border-dashed border-neutral-300 p-12 py-24 text-center dark:border-neutral-700">
            <div className="mb-6 bg-neutral-100 p-6 dark:bg-neutral-900">
                <Icon size={48} className="text-neutral-400" />
            </div>
            <h3 className="mb-2 text-3xl font-black tracking-tighter uppercase">
                {title}
            </h3>
            <p className="mb-8 max-w-sm font-mono text-xs text-neutral-500 uppercase">
                {description}
            </p>
            <Button
                variant="outline"
                className="h-12 rounded-none border-2 border-black px-8 font-black uppercase dark:border-white"
                asChild
            >
                <Link href={actionHref}>+ {actionLabel}</Link>
            </Button>
        </div>
    );
}
