import { SidebarProvider } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}


export function AppShell({
    children,
}: {
    children: React.ReactNode;
}) {
return (
    <SidebarProvider>
        <div className="flex min-h-screen w-full ">
            {children}
        </div>
    </SidebarProvider>
);
}
