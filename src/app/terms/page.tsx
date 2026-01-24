'use client'

import { Footer } from '@/components/footer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 flex flex-col">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center gap-6">
                    <Link href="/">
                        <Button variant="ghost" className="text-zinc-400 hover:text-white pl-0">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1 pt-32 pb-20 px-6">
                <div className="max-w-3xl mx-auto space-y-12">

                    <div className="space-y-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">TÉRMINOS, CONDICIONES Y ACUERDO DE PRIVACIDAD</h1>
                        <p className="text-zinc-500 uppercase tracking-widest text-sm">Americana Stores &mdash; Última actualización: 10 de Enero, 2026</p>
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none space-y-8 text-zinc-300">
                        <p className="lead border-l-2 border-primary pl-6 italic text-xl text-zinc-100">
                            Bienvenido a Americana Stores. Al acceder a nuestra plataforma, usted acepta estar sujeto a los siguientes términos. Este es un espacio de <strong>Acceso Exclusivo</strong> diseñado para la comercialización de productos de bienestar adulto (Sex Shop) y parafernalia (Smoke Shop).
                        </p>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif text-white border-b border-white/10 pb-2">1. Modelo de Marketplace por Invitación</h2>
                            <p>Americana Stores opera bajo un modelo de <strong>Círculo Cerrado</strong>.</p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-zinc-500">
                                <li><strong>Admisión:</strong> La apertura de tiendas está limitada estrictamente a distribuidores que hayan recibido una invitación formal y hayan superado nuestro filtro de identidad, estética y legalidad.</li>
                                <li><strong>Requisitos:</strong> Nos reservamos el derecho de admisión y permanencia. Si una tienda deja de cumplir con los estándares visuales o éticos de la plataforma, su acceso será revocado sin previo aviso.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif text-white border-b border-white/10 pb-2">2. Deslinde de Responsabilidad (Limitation of Liability)</h2>
                            <p>Americana Stores es una plataforma tecnológica de intermediación.</p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-zinc-500">
                                <li><strong>Independencia:</strong> Cada vendedor (Socio Comercial) opera de manera independiente. Americana Tienda no es fabricante, ni propietario, ni responsable directo de los productos listados.</li>
                                <li><strong>Garantías:</strong> Cualquier reclamación sobre la calidad, funcionamiento o seguridad de los artículos debe ser dirigida directamente al distribuidor responsable.</li>
                                <li><strong>Uso de Productos:</strong> El usuario asume toda la responsabilidad por el uso de los artículos adquiridos. Nos deslindamos de cualquier daño derivado del uso inadecuado de productos de bienestar o parafernalia.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif text-white border-b border-white/10 pb-2">3. Normas de Conducta y Filtros de Seguridad</h2>
                            <p>Para mantener la integridad de nuestra comunidad, aplicamos una política de <strong>Tolerancia Cero</strong>:</p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-zinc-500">
                                <li><strong>Contenido Prohibido:</strong> Queda prohibida la venta de sustancias ilegales, contenido explícito que infrinja leyes de dignidad humana o productos que no cuenten con las regulaciones sanitarias correspondientes.</li>
                                <li><strong>Cancelación de Cuentas:</strong> Americana Stores monitorea constantemente el inventario. Nos reservamos el derecho unilateral de cancelar cuentas, retener pagos en disputa o banear de forma permanente a cualquier distribuidor o usuario que infrinja nuestras normas.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif text-white border-b border-white/10 pb-2">4. Política de Privacidad y Confidencialidad</h2>
                            <p>Entendemos la naturaleza sensible de nuestro mercado.</p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-zinc-500">
                                <li><strong>Protección de Datos:</strong> Utilizamos encriptación de grado bancario para proteger su identidad y sus transacciones.</li>
                                <li><strong>Anonimato:</strong> Sus datos de consumo son privados y no serán compartidos, vendidos ni exhibidos a terceros para fines comerciales externos al ecosistema de Americana Stores.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif text-white border-b border-white/10 pb-2">5. Propiedad Intelectual</h2>
                            <p>El diseño, la estética Avant-Garde, los videos y la marca "Americana Stores" son propiedad intelectual exclusiva. Queda prohibida la reproducción total o parcial de nuestra interfaz o concepto visual sin autorización expresa.</p>
                        </section>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
