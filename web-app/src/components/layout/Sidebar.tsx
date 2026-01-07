"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Zap,
  Code,
  FileText,
  Users,
  Settings,
  Download,
  BookOpen,
  MessageSquare,
  Github,
  Database,
  TestTube,
  Rocket,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Crown,
  BarChart3,
  Layers,
  Shield,
  Cloud,
  Wrench,
  Wand2,
  ShoppingCart,
  Puzzle,
  Shuffle,
  Palette,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const navigationItems = [
  { name: "Dashboard", href: "/", icon: Home, badge: null },
  { name: "AI Generator", href: "/generate", icon: Sparkles, badge: "New" },
  { name: "Website Cloner", href: "/clone", icon: Wand2, badge: "AI" },
  { name: "Code Editor", href: "/editor", icon: Code, badge: null },
  { name: "Marketplace", href: "/marketplace", icon: ShoppingCart, badge: "500+" },
  { name: "Plugins", href: "/plugins", icon: Puzzle, badge: "25+" },
  { name: "Community", href: "/community", icon: MessageSquare, badge: "12K" },
  { name: "Projects", href: "/projects", icon: FileText, badge: null },
  { name: "Templates", href: "/templates", icon: Palette, badge: "50+" },
  { name: "Testing", href: "/testing", icon: TestTube, badge: "AI" },
  { name: "Refactor", href: "/refactor", icon: Shuffle, badge: "AI" },
  { name: "UI Builder", href: "/ui-builder", icon: Palette, badge: "New" },
  { name: "Deploy", href: "/deploy", icon: Rocket, badge: "10+" },
]

const resourcesItems = [
  { name: "Documentation", href: "/docs", icon: BookOpen, description: "Guides & API" },
  { name: "Community", href: "/community", icon: MessageSquare, description: "Forum & Discord" },
  { name: "GitHub", href: "https://github.com", icon: Github, external: true, description: "Source code" },
]

const integrations = [
  { name: "Supabase", icon: Database, color: "from-green-500 to-emerald-600" },
  { name: "GitHub", icon: Github, color: "from-gray-700 to-gray-900" },
  { name: "Vercel", icon: Cloud, color: "from-black to-gray-800" },
  { name: "Stripe", icon: BarChart3, color: "from-purple-600 to-indigo-700" },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn(
      "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 shadow-xl",
      collapsed ? "w-16" : "w-72"
    )}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Codiner</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">AI App Builder</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
          <Button
            className="w-full btn-gradient shadow-lg"
            size={collapsed ? "icon" : "default"}
          >
            {collapsed ? (
              <Plus className="h-5 w-5" />
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                New Project
              </>
            )}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 py-4">
            {navigationItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group hover:scale-105",
                    pathname === item.href
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
                    collapsed && "justify-center px-3"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between">
                      <span>{item.name}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-white/20 text-white border-0">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {!collapsed && (
            <>
              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Resources
                </h3>
                {resourcesItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 group"
                  >
                    <item.icon className="h-5 w-5 mr-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                    <div>
                      <div>{item.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{item.description}</div>
                    </div>
                  </a>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Integrations
                </h3>
                <div className="grid grid-cols-2 gap-3 px-4">
                  {integrations.map((integration) => (
                    <div
                      key={integration.name}
                      className={`flex items-center justify-center w-full h-12 bg-gradient-to-br ${integration.color} rounded-xl cursor-pointer hover:scale-105 transition-all duration-200 shadow-md`}
                    >
                      <integration.icon className="h-5 w-5 text-white" />
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Quick Stats */}
              <div className="px-4 py-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">AI Credits</span>
                  </div>
                  <Crown className="h-4 w-4 text-purple-600" />
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  1,247 / 2,000
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full w-3/5 animate-pulse"></div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Resets in 5 days</p>
              </div>
            </>
          )}
        </ScrollArea>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enterprise-grade security & privacy
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
