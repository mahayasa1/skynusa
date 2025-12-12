import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { ReactNode } from 'react';
import { GoogleAnalytics } from '@/components/analytics';


interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <GoogleAnalytics trackingId="G-XXXXXXXXXX" />
            <Navigation />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}