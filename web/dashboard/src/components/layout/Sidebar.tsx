"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  Sparkles,
  Code,
  Users,
  Rocket,
  Book,
  Settings,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  Store,
  Puzzle,
  Languages,
  FlaskConical,
  Cloud,
  Lock,
  Handshake,
  Lightbulb,
  Palette,
  MousePointer2,
  RefreshCcw,
  Zap,
  MessageSquareText,
  Bug,
  FileCode,
  Download,
  Upload,
  Globe,
  ShoppingCart,
  BarChart3,
  Newspaper,
  Megaphone,
  CreditCard,
  FolderKanban,
  ShieldCheck,
  Clock,
  Accessibility,
  MoonStar,
  Paintbrush,
  Move,
  GitPullRequest,
  Search,
  Plus,
  Star,
  Award,
  Heart,
  Share2,
  MessageSquare,
  Bell,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const navItems = [
    {
      category: "Core Features",
      items: [
        { href: "/", icon: Sparkles, label: "AI App Generator", badge: "New" },
        { href: "/editor", icon: Code, label: "Code Editor", badge: "Pro" },
        { href: "/clone", icon: Globe, label: "Clone Website", badge: "Pro" },
        { href: "/ui-builder", icon: MousePointer2, label: "UI Builder", badge: "Pro" },
        { href: "/templates", icon: FolderKanban, label: "Templates" },
        { href: "/projects", icon: LayoutDashboard, label: "My Projects" },
      ],
    },
    {
      category: "AI Tools",
      items: [
        { href: "/ai-completion", icon: Zap, label: "Code Completion", badge: "Pro" },
        { href: "/ai-debugging", icon: Bug, label: "Code Debugging", badge: "Pro" },
        { href: "/ai-explanation", icon: Lightbulb, label: "Code Explanation", badge: "Pro" },
        { href: "/ai-refactoring", icon: RefreshCcw, label: "Code Refactoring", badge: "Pro" },
      ],
    },
    {
      category: "Development",
      items: [
        { href: "/version-control", icon: GitBranch, label: "Version Control" },
        { href: "/testing", icon: FlaskConical, label: "Automated Testing" },
        { href: "/deployment", icon: Cloud, label: "Deployment" },
        { href: "/plugins", icon: Puzzle, label: "Plugins" },
        { href: "/multi-language", icon: Languages, label: "Multi-Language" },
      ],
    },
    {
      category: "Platform",
      items: [
        { href: "/auth", icon: Lock, label: "Authentication" },
        { href: "/collaboration", icon: Handshake, label: "Collaboration", badge: "Team" },
        { href: "/marketplace", icon: Store, label: "Marketplace" },
        { href: "/community", icon: MessageSquareText, label: "Community Hub" },
        { href: "/docs", icon: Book, label: "Documentation" },
        { href: "/accessibility", icon: Accessibility, label: "Accessibility" },
        { href: "/theme-customizer", icon: Paintbrush, label: "Theme Customizer" },
        { href: "/settings", icon: Settings, label: "Settings" },
        { href: "/support", icon: LifeBuoy, label: "Support" },
      ],
    },
  ]

  return (
    <aside
      className={`
        h-screen sticky top-0 left-0
        bg-background/80 backdrop-blur-md border-r border-border/40
        flex flex-col
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-20" : "w-64"}
      `}
    >
      <div className="flex items-center justify-between h-16 px-4">
        {!isCollapsed && (
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Codiner Logo" width={32} height={32} className="rounded-full" />
            <span className="text-xl font-bold text-foreground">Codiner</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="rounded-full hover:bg-accent/50"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <Separator className="bg-border/40" />

      <ScrollArea className="flex-1 py-4">
        <nav className="grid items-start gap-2 px-4">
          {navItems.map((category, index) => (
            <div key={category.category} className="mb-4">
              {!isCollapsed && (
                <h3 className="mb-2 text-sm font-semibold text-muted-foreground tracking-wider uppercase">
                  {category.category}
                </h3>
              )}
              {category.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                    transition-all hover:bg-accent hover:text-primary
                    ${isCollapsed ? "justify-center" : ""}
                  `}
                >
                  <item.icon className={`h-5 w-5 ${isCollapsed ? "mx-auto" : ""}`} />
                  {!isCollapsed && (
                    <>
                      {item.label}
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              ))}
              {index < navItems.length - 1 && <Separator className="my-4 bg-border/40" />}
            </div>
          ))}
        </nav>
      </ScrollArea>

      <Separator className="bg-border/40" />

      <div className="p-4">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} text-sm text-muted-foreground`}>
          {!isCollapsed && <span>AI Credits:</span>}
          <Badge variant="secondary" className={`${isCollapsed ? "mx-auto" : ""}`}>50</Badge>
        </div>
        {!isCollapsed && (
          <Button variant="link" size="sm" className="w-full mt-2">
            Buy More Credits
          </Button>
        )}
      </div>
    </aside>
  )
}
