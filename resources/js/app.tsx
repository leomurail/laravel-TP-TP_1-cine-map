import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const rootElement = (
            <TooltipProvider delayDuration={0}>
                <App {...props} />
                <Toaster />
            </TooltipProvider>
        );

        if (import.meta.env.DEV) {
            createRoot(el).render(rootElement);

            return;
        }

        hydrateRoot(el, rootElement);
    },
    layout: (name, page: any) => {
        const pageComponent = page.default ?? page;

        if (
            typeof pageComponent.layout === 'function' ||
            Array.isArray(pageComponent.layout)
        ) {
            return null;
        }

        const layoutProps = typeof pageComponent.layout === 'object' ? pageComponent.layout : {};

        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return (props: any) => <AuthLayout {...layoutProps} {...props} />;
            case name.startsWith('settings/'):
                return (props: any) => (
                    <AppLayout {...layoutProps} {...props}>
                        <SettingsLayout {...props} />
                    </AppLayout>
                );
            default:
                return (props: any) => <AppLayout {...layoutProps} {...props} />;
        }
    },
    strictMode: true,
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

console.log('Inertia app starting...');
