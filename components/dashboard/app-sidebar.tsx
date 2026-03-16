"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AudioLines, Home, Mic, FileText, Settings, LogOut, ChevronsUpDown, User } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarSeparator, useSidebar,
} from "@/components/ui/sidebar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

// Removed static nav arrays because we need the 't' function from useLanguage dynamically

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();
  const { t } = useLanguage();

  const navMain = [
    { title: t("sidebar.home"), url: "/dashboard", icon: Home },
    { title: t("sidebar.transcribe"), url: "/dashboard/transcribe", icon: Mic },
    { title: t("sidebar.recordings"), url: "/dashboard/recordings", icon: FileText },
  ];

  const navSecondary = [
    { title: t("sidebar.settings"), url: "/dashboard/settings", icon: Settings },
  ];

  function handleClick() {
    if (isMobile) setOpenMobile(false);
  }

  function handleLogout() {
    router.push("/login");
  }

  return (
    <Sidebar collapsible="icon">
      {/* Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/dashboard" onClick={handleClick} className="flex items-center gap-2">
                <div className="bg-primary flex size-5 items-center justify-center rounded-md">
                  <AudioLines className="text-primary-foreground size-3.5" />
                </div>
                <span className="text-base font-semibold">Sonix</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main nav */}
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => {
                const active = pathname === item.url || (item.url !== "/dashboard" && pathname.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={active}>
                      <Link href={item.url} onClick={handleClick} className="flex items-center gap-2">
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Secondary nav */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {navSecondary.map((item) => {
                const active = pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild size="sm" tooltip={item.title} isActive={active}>
                      <Link href={item.url} onClick={handleClick} className="flex items-center gap-2">
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User nav */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                >
                  <Avatar.Root className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Avatar.Fallback className="text-xs font-medium">AD</Avatar.Fallback>
                  </Avatar.Root>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">admin</span>
                    <span className="truncate text-xs text-muted-foreground">admin@sonix.app</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="bg-popover text-popover-foreground z-50 min-w-56 rounded-lg border p-1 shadow-md"
                  side="right"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenu.Label className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    {t("settings.account")}
                  </DropdownMenu.Label>
                  <DropdownMenu.Separator className="my-1 h-px bg-border" />
                  <DropdownMenu.Item
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none",
                      "hover:bg-accent hover:text-accent-foreground"
                    )}
                    onSelect={() => router.push("/dashboard/settings")}
                  >
                    <User className="size-4" />
                    {t("sidebar.settings")}
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none text-destructive",
                      "hover:bg-destructive/10"
                    )}
                    onSelect={handleLogout}
                  >
                    <LogOut className="size-4" />
                    {t("header.login").replace("Yap", "Çık")} {/* Basic logout until further loc */}
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
