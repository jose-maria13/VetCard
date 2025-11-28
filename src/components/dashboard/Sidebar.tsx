'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard,
    Dog,
    Calendar,
    Settings,
    LogOut,
    Menu,
    X,
    FileText,
    Shield,
    Stethoscope,
    Syringe,
    ChevronRight
} from 'lucide-react'
import Logo from '@/components/Logo'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'

interface SidebarProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const pathname = usePathname()
    const { signOut } = useAuth()

    const menuItems = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/history', icon: FileText, label: 'Historial Médico' },
        { href: '/vaccine/new', icon: Syringe, label: 'Vacunas' },
        { href: '/deworming/new', icon: Shield, label: 'Desparasitación' },
        { href: '/consultation/new', icon: Stethoscope, label: 'Consultas' },
    ]

    const isActive = (path: string) => pathname === path

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <motion.aside
                className={`fixed top-0 left-0 z-50 h-screen bg-[#081028] text-white transition-all duration-300 ease-in-out border-r border-slate-800
          ${isOpen ? 'w-[270px] translate-x-0' : 'w-[270px] -translate-x-full lg:translate-x-0'}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="h-20 flex items-center px-6 border-b border-slate-800">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <Logo size="md" showText={true} className="text-white" />
                        </Link>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="ml-auto lg:hidden text-slate-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                        <div className="mb-6">
                            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Menu Principal
                            </p>
                            <ul className="space-y-1">
                                {menuItems.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                        ${isActive(item.href)
                                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                                }
                      `}
                                        >
                                            <item.icon className={`w-5 h-5 ${isActive(item.href) ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                                            <span className="font-medium">{item.label}</span>
                                            {isActive(item.href) && (
                                                <ChevronRight className="w-4 h-4 ml-auto" />
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Quick Actions Section could go here */}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-800 bg-[#050a1f]">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-white">Modo Oscuro</p>
                            </div>
                            <ThemeToggle />
                        </div>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            onClick={() => signOut()}
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Cerrar Sesión
                        </Button>
                    </div>
                </div>
            </motion.aside>
        </>
    )
}
