import { Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
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
  Settings,
  ChevronDown,
  User,
  Building2,
  Briefcase,
  Image,
  Tags,
  BadgeCheck,
  Puzzle,
  BookImage,
  BookText,
} from 'lucide-react';

interface SidebarProps {
  currentPath?: string;
}

type ChildMenuItem = {
  name: string;
  href: string;
  icon: any;
};

type MenuItem = {
  name: string;
  href?: string;
  icon: any;
  children?: ChildMenuItem[];
};

export default function ModernSidebar({ currentPath = '' }: SidebarProps) {
  const menuItems: MenuItem[] = [
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
    {
      name: 'Management',
      icon: Settings,
      children: [
        { name: 'User', href: '/admin/management/user', icon: User },
        { name: 'Company', href: '/admin/management/company', icon: Building2 },
        { name: 'Service', href: '/admin/management/service', icon: Briefcase },
        { name: 'Portfolio', href: '/admin/management/portfolio', icon: BookText },
        { name: 'Categories', href: '/admin/management/categories', icon: Tags },
        { name: 'Jabatan', href: '/admin/management/jabatan', icon: BadgeCheck },
        { name: 'Features', href: '/admin/management/features', icon: Puzzle },
      ],
    },
  ];

  const isActive = (href: string) => currentPath.startsWith(href);

  const [openManagement, setOpenManagement] = useState(false);

  // Auto open dropdown jika salah satu child aktif
  useEffect(() => {
    const management = menuItems.find((m) => m.name === 'Management');
    if (management?.children?.some((c) => isActive(c.href))) {
      setOpenManagement(true);
    }
  }, [currentPath]);

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin logout?')) {
      router.post('/logout');
    }
  };

  return (
    <Sidebar collapsible="icon" className="bg-blue-900 text-blue-100">
      {/* ===== HEADER ===== */}
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-blue-700/40 bg-blue-900/95">
        <img
          src="/asset/footer-logo.png"
          alt="SKYNUSA TECH"
          className="h-8 w-auto transition-all group-data-[collapsible=icon]:hidden"
        />
        <img
          src="/asset/logo_skynusa2.png"
          alt="SN"
          className="hidden h-8 w-8 group-data-[collapsible=icon]:block"
        />
      </SidebarHeader>

      {/* ===== MENU ===== */}
      <SidebarContent className="bg-blue-900">
        <SidebarMenu>
          {menuItems.map((item) => {
            // ===== MENU TANPA CHILD =====
            if (!item.children) {
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href!)}
                    tooltip={item.name}
                    className="
                      flex items-center gap-3
                      text-blue-100
                      hover:bg-blue-800/60
                      data-[active=true]:bg-blue-700
                      data-[active=true]:text-white
                    "
                  >
                    <Link href={item.href!}>
                      <item.icon className="h-5 w-5 text-blue-200" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }

            // ===== MANAGEMENT DROPDOWN =====
            return (
              <SidebarMenuItem key={item.name}>
                {/* Parent */}
                <SidebarMenuButton
                  onClick={() => setOpenManagement(!openManagement)}
                  tooltip={item.name}
                  className="
                    flex items-center gap-3
                    text-blue-100
                    hover:bg-blue-800/60
                  "
                >
                  <item.icon className="h-5 w-5 text-blue-200" />
                  <span className="font-medium flex-1">{item.name}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openManagement ? 'rotate-180' : ''
                    }`}
                  />
                </SidebarMenuButton>

                {/* Children */}
                <div
                  className={` ml-9 grid transition-all duration-300 ease-in-out ${openManagement ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
                  `}
                >
                  <div className="overflow-hidden flex flex-col gap-1 mt-1">
                    {item.children.map((child) => (
                      <SidebarMenuButton
                        key={child.href}
                        asChild
                        isActive={isActive(child.href)}
                        className="
                          flex items-center gap-3
                          text-blue-100
                          hover:bg-blue-800/60
                          data-[active=true]:bg-blue-700
                          data-[active=true]:text-white
                        "
                      >
                        <Link href={child.href}>
                          <child.icon className="h-4 w-4 text-blue-300" />
                          <span>{child.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    ))}
                  </div>
                </div>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* ===== LOGOUT ===== */}
      <SidebarFooter className="border-t border-blue-700/40 bg-blue-900/95">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className="text-blue-100 hover:bg-red-500/20 hover:text-red-300"
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
