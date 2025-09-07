"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Brain, Menu, User, Settings, LogOut, BarChart3, BookOpen, Phone, Info, History } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import Image from "next/image"

interface WrapperProps {
    children: React.ReactNode
}

export default function Wrapper({ children }: WrapperProps) {
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            setUser(user)

            if (user) {
                const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
                setProfile(profile)
            }
            setLoading(false)
        }

        getUser()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()
                setProfile(profile)
            } else {
                setProfile(null)
            }
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [supabase])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push("/")
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const isAuthPage = pathname?.startsWith("/auth/")

    if (isAuthPage) {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-lg shadow-black/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-700 via-purple-900 to-cyan-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-105">
                                {/* <Brain className="w-6 h-6 text-white" /> */}
                                <Image src="/next-step-logo.png" alt="NextStep Logo" width={24} height={24} />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                NextStep
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-1">
                            <NavigationMenu>
                                <NavigationMenuList className="space-x-1">
                                    <NavigationMenuItem>
                                        <Link href="/about" legacyBehavior passHref>
                                            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-xl bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
                                                <Info className="w-4 h-4 mr-2" />
                                                About
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <Link href="/contact" legacyBehavior passHref>
                                            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-xl bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
                                                <Phone className="w-4 h-4 mr-2" />
                                                Contact
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                    {user && (
                                        <NavigationMenuItem>
                                            <Link href="/quiz" legacyBehavior passHref>
                                                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-xl bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
                                                    <BookOpen className="w-4 h-4 mr-2" />
                                                    Take Quiz
                                                </NavigationMenuLink>
                                            </Link>
                                        </NavigationMenuItem>
                                    )}
                                </NavigationMenuList>
                            </NavigationMenu>

                            {loading ? (
                                <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full animate-pulse ml-4" />
                            ) : user ? (
                                <div className="flex items-center space-x-3 ml-4">
                                    <Link href="/dashboard">
                                        <Button
                                            variant="outline"
                                            className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400/50 bg-transparent backdrop-blur-sm transition-all duration-200 rounded-xl"
                                        >
                                            <BarChart3 className="w-4 h-4 mr-2" />
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <UserMenu user={user} profile={profile} onSignOut={handleSignOut} />
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3 ml-4">
                                    <Link href="/auth/login">
                                        <Button
                                            variant="ghost"
                                            className="text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                                        >
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href="/auth/signup">
                                        <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-200 rounded-xl">
                                            Get Started
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="md:hidden">
                            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-xl">
                                        <Menu className="w-5 h-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-80 bg-slate-900/95 backdrop-blur-xl border-slate-800">
                                    <div className="flex flex-col space-y-4 mt-8">
                                        <Link
                                            href="/about"
                                            className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors p-3 rounded-xl hover:bg-white/10"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <Info className="w-5 h-5" />
                                            <span>About</span>
                                        </Link>
                                        <Link
                                            href="/contact"
                                            className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors p-3 rounded-xl hover:bg-white/10"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <Phone className="w-5 h-5" />
                                            <span>Contact</span>
                                        </Link>
                                        {user && (
                                            <>
                                                <Link
                                                    href="/quiz"
                                                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors p-3 rounded-xl hover:bg-white/10"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    <BookOpen className="w-5 h-5" />
                                                    <span>Take Quiz</span>
                                                </Link>
                                                <Link
                                                    href="/dashboard"
                                                    className="flex items-center space-x-3 text-blue-400 hover:text-blue-300 transition-colors p-3 rounded-xl hover:bg-blue-500/10"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    <BarChart3 className="w-5 h-5" />
                                                    <span>Dashboard</span>
                                                </Link>
                                            </>
                                        )}

                                        <div className="border-t border-slate-800 pt-4">
                                            {user ? (
                                                <div className="space-y-2">
                                                    <div className="flex items-center space-x-3 p-3">
                                                        <Avatar className="w-10 h-10 ring-2 ring-blue-500/20">
                                                            <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 text-white text-sm font-semibold">
                                                                {profile?.full_name ? getInitials(profile.full_name) : "U"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-white font-medium">{profile?.full_name || "User"}</p>
                                                            <p className="text-gray-400 text-sm">{user.email}</p>
                                                        </div>
                                                    </div>
                                                    <Link
                                                        href="/dashboard/profile"
                                                        className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors p-3 rounded-xl hover:bg-white/10"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        <Settings className="w-5 h-5" />
                                                        <span>Settings</span>
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            handleSignOut()
                                                            setMobileMenuOpen(false)
                                                        }}
                                                        className="flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors p-3 rounded-xl hover:bg-red-500/10 w-full text-left"
                                                    >
                                                        <LogOut className="w-5 h-5" />
                                                        <span>Sign Out</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <Link
                                                        href="/auth/login"
                                                        className="block w-full text-center p-3 text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-white/10"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        Sign In
                                                    </Link>
                                                    <Link
                                                        href="/auth/signup"
                                                        className="block w-full text-center p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        Get Started
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Enhanced footer */}
            <Footer />
        </div>
    )
}

function UserMenu({ user, profile, onSignOut }: { user: SupabaseUser; profile: any; onSignOut: () => void }) {
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full hover:bg-white/10 transition-all duration-200"
                >
                    <Avatar className="h-10 w-10 ring-2 ring-blue-500/20 hover:ring-blue-400/40 transition-all duration-200">
                        <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.full_name || "User"} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 text-white font-semibold">
                            {profile?.full_name ? getInitials(profile.full_name) : "U"}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-64 bg-slate-800/95 backdrop-blur-xl border-slate-700 rounded-xl shadow-xl"
                align="end"
                forceMount
            >
                <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12 ring-2 ring-blue-500/20">
                            <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 text-white font-semibold">
                                {profile?.full_name ? getInitials(profile.full_name) : "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="text-sm font-medium leading-none text-white">{profile?.full_name || "User"}</p>
                            <p className="text-xs leading-none text-gray-400 mt-1">{user.email}</p>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem
                    asChild
                    className="text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg mx-2 my-1 transition-colors"
                >
                    <Link href="/dashboard/profile">
                        <User className="mr-3 h-4 w-4" />
                        <span>Profile Settings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    asChild
                    className="text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg mx-2 my-1 transition-colors"
                >
                    <Link href="/dashboard">
                        <BarChart3 className="mr-3 h-4 w-4" />
                        <span>Dashboard</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    asChild
                    className="text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg mx-2 my-1 transition-colors"
                >
                    <Link href="/quiz/review">
                        <History className="mr-3 h-4 w-4" />
                        <span>Quiz History</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer rounded-lg mx-2 my-1 transition-colors"
                    onClick={onSignOut}
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Sign out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function Footer() {
    return (
        <footer className="border-t border-white/10 bg-slate-900 backdrop-blur-sm py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-700 via-purple-900 to-cyan-700 rounded-xl flex items-center justify-center shadow-lg">
                                {/* <Brain className="w-6 h-6 text-white" /> */}
                                <Image src="/next-step-logo.png" alt="NextStep Logo" width={24} height={24}  />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                NextStep
                            </span>
                        </div>
                        <p className="text-gray-400 mb-4 max-w-md">
                            Empowering Indian students to make informed career decisions with AI-powered assessments and personalized
                            guidance.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <div className="space-y-2">
                            <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">
                                About Us
                            </Link>
                            <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">
                                Contact
                            </Link>
                            <Link href="/privacy-policy" className="block text-gray-400 hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-4">Get Started</h3>
                        <div className="space-y-2">
                            <Link href="/auth/signup" className="block text-gray-400 hover:text-white transition-colors">
                                Sign Up
                            </Link>
                            <Link href="/auth/login" className="block text-gray-400 hover:text-white transition-colors">
                                Sign In
                            </Link>
                            <Link href="/quiz" className="block text-gray-400 hover:text-white transition-colors">
                                Take Quiz
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2024 NextStep. All rights reserved. Made with ❤️ for Indian students.</p>
                </div>
            </div>
        </footer>
    )
}
