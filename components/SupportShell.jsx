"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, LayoutDashboard, Lightbulb, ListChecks, LogOut, Ticket, Users } from "lucide-react";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SupportAccessGuard } from "@/components/SupportAccessGuard";
import { ProfileSwitcher } from "@/components/ProfileSwitcher";
import { AccessibilityMenu } from "@/components/AccessibilityMenu";

const navigation = [
  { href: "/suporte", label: "Visão geral", icon: LayoutDashboard },
  { href: "/suporte/chamados", label: "Chamados", icon: Ticket },
  { href: "/suporte/problemas", label: "Problemas comuns", icon: BarChart3 },
  { href: "/suporte/insights", label: "Insights", icon: Lightbulb },
];

export function SupportShell({ children }) {
  const pathname = usePathname();
  return <SupportAccessGuard>
    <SidebarProvider>
      <Sidebar collapsible="offcanvas" className="border-r border-white/10 bg-slate-950">
        <SidebarHeader className="border-b border-white/10 p-5"><div className="[&_p]:text-white [&_p:last-child]:text-slate-400"><Brand /></div></SidebarHeader>
        <SidebarContent className="px-3 py-5">
          <SidebarGroup><SidebarGroupLabel className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Central de suporte</SidebarGroupLabel><SidebarGroupContent><SidebarMenu>
            {navigation.map((item) => <SidebarMenuItem key={item.href}><SidebarMenuButton asChild isActive={pathname === item.href} className="h-11 rounded-xl px-3 text-slate-300 data-[active=true]:bg-blue-600 data-[active=true]:text-white hover:bg-white/8 hover:text-white"><Link href={item.href}><item.icon className="size-4" /><span>{item.label}</span></Link></SidebarMenuButton></SidebarMenuItem>)}
          </SidebarMenu></SidebarGroupContent></SidebarGroup>
          <SidebarGroup className="mt-5"><SidebarGroupLabel className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Análise</SidebarGroupLabel><SidebarGroupContent><SidebarMenu>
            <SidebarMenuItem><SidebarMenuButton className="h-11 px-3 text-slate-400"><Users className="size-4" /><span>Usuários afetados</span></SidebarMenuButton></SidebarMenuItem>
            <SidebarMenuItem><SidebarMenuButton className="h-11 px-3 text-slate-400"><ListChecks className="size-4" /><span>Padrões encontrados</span></SidebarMenuButton></SidebarMenuItem>
          </SidebarMenu></SidebarGroupContent></SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-white/10 p-4"><Button asChild variant="ghost" className="justify-start text-slate-400 hover:bg-white/8 hover:text-white"><Link href="/"><LogOut className="size-4" />Área do usuário</Link></Button></SidebarFooter>
      </Sidebar>
      <SidebarInset className="min-w-0 bg-slate-50">
        <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-7"><div className="flex items-center gap-3"><SidebarTrigger /><div><p className="text-sm font-bold text-slate-950">Central de Suporte</p><p className="text-xs text-slate-500">Diagnósticos claros, atendimento mais rápido</p></div></div><div className="flex items-center gap-3"><span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500 sm:inline">Dados demonstrativos</span><AccessibilityMenu /><ProfileSwitcher compact /></div></header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  </SupportAccessGuard>;
}
