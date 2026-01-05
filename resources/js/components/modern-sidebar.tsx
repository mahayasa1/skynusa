import { Link, router } from '@inertiajs/react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  MessageSquare,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  currentPath?: string;
}

export default function ModernSidebar({ currentPath = '' }: SidebarProps) {
  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Order',
      href: '/admin/pesanan',
      icon: ShoppingCart,
    },
    {
      name: 'Berita',
      href: '/admin/berita',
      icon: FileText,
    },
    {
      name: 'Ulasan',
      href: '/admin/ulasan',
      icon: MessageSquare,
    },
  ];

  const isActive = (href: string) => currentPath.startsWith(href);

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin logout?')) {
      router.post('/logout');
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="bg-blue-900 text-blue-100"
    >
      {/* Logo */}
     <SidebarHeader className="h-16 flex items-center justify-center border-b border-blue-700/40 bg-blue-900/95">
  {/* Logo FULL (sidebar terbuka) */}
  <img
    src="/asset/footer-logo.png"
    alt="SKYNUSA TECH"
    className="
      h-8 w-auto
      transition-all duration-200
      group-data-[collapsible=icon]:hidden
    "
  />

  {/* Logo ICON (sidebar tertutup) */}
  <img
    src="/asset/logo_skynusa2.png"
    alt="SN"
    className="
    hidden
    h-8 w-8
    scale-90 opacity-0
    transition-all duration-200
    group-data-[collapsible=icon]:block
    group-data-[collapsible=icon]:scale-100
    group-data-[collapsible=icon]:opacity-100
    "
  />
</SidebarHeader>

      {/* Menu */}
      <SidebarContent className="bg-blue-900">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={item.name}
                className="
                  text-blue-100
                  hover:bg-blue-800/60
                  data-[active=true]:bg-blue-700
                  data-[active=true]:text-white
                "
              >
                <Link href={item.href} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-blue-200" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Logout */}
      <SidebarFooter className="border-t border-blue-700/40 bg-blue-900/95">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className="
                text-blue-100
                hover:bg-red-500/20
                hover:text-red-300
              "
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
