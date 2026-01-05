import { SidebarProvider } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import * as React from 'react';


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
