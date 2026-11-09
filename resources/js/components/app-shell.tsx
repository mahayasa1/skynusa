import { SidebarProvider } from '@/components/ui/sidebar';
import * as React from 'react';

export function AppShell({ children }: { children: React.ReactNode }) {
    React.useLayoutEffect(() => {
        const root = document.documentElement;
        root.classList.add('admin-dark');
        return () => root.classList.remove('admin-dark');
    }, []);

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">{children}</div>
        </SidebarProvider>
    );
}
