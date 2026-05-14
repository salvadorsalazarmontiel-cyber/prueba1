"use client";

import { RegistrationForm } from "@/components/RegistrationForm";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { Heart, HandHeart, Users, ChevronDown, Mail, Phone, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen aero-bg overflow-hidden text-gray-800 font-sans">
      {/* Navbar tipo Glass */}
      <nav className="fixed top-0 w-full z-50 glass-panel rounded-none border-t-0 border-x-0 border-b-white/50 backdrop-blur-md px-4 md:px-6 py-3 md:py-4 flex justify-between items-center transition-all">
        <div className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="w-8 h-8 md:w-10 md:h-10 object-contain" />
          <span className="font-bold text-lg md:text-xl tracking-tight text-purple-900">Manitas para To2</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-purple-900/80">
          <a href="#inicio" className="hover:text-purple-600 transition-colors">Inicio</a>
          <a href="#nosotros" className="hover:text-purple-600 transition-colors">Nosotros</a>
          <a href="#ayudamos" className="hover:text-purple-600 transition-colors">Cómo Ayudamos</a>
          <a href="#solicitud" className="hover:text-purple-600 transition-colors">Solicitar</a>
        </div>
        <div className="flex gap-2">
          <Link href="/seguimiento" className="px-3 md:px-4 py-2 rounded-full glass-button text-xs md:text-sm flex items-center gap-2 font-semibold">
            <Search className="w-4 h-4 text-purple-600" /> <span className="hidden sm:inline">Rastrear Folio</span>
          </Link>
          <a href="#solicitud" className="hidden sm:block px-4 py-2 rounded-full glass-button-primary aero-glow text-sm">
            Pedir Ayuda
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        id="inicio"
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 flex flex-col items-center text-center min-h-[90vh] justify-center"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
           <div className="absolute top-40 -left-40 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-5xl mx-auto flex flex-col items-center"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-purple-100/60 border border-purple-200 text-purple-800 text-sm font-semibold mb-6 backdrop-blur-sm shadow-sm">
            Fundación Sin Fines de Lucro
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6 drop-shadow-sm">
            Cambiando el mundo,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-yellow-500">
              una mano a la vez
            </span>
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-gray-600 max-w-3xl mx-auto font-light">
            Motivados por brindar nuevas oportunidades y llevar sonrisas a todo aquel que las necesite. 
            Buscamos lograr una mejor calidad de vida con una manita de apoyo.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
             <a href="#solicitud" className="px-8 py-4 rounded-full glass-button-primary text-lg font-bold aero-glow w-full sm:w-auto shadow-xl">
               Solicitar Prótesis Gratis
             </a>
             <Link href="/seguimiento" className="px-8 py-4 rounded-full glass-button text-lg font-bold w-full sm:w-auto flex items-center justify-center gap-2 border-purple-200 text-purple-900">
               Ya tengo un folio <Search className="w-5 h-5 text-yellow-500" />
             </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-purple-400"
        >
          <ChevronDown className="w-10 h-10" />
        </motion.div>
      </motion.section>

      {/* Nosotros Section */}
      <section id="nosotros" className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4">Nuestro Propósito</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-yellow-400 mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image src="/images/img1.png" alt="Nosotros" width={800} height={600} className="w-full h-auto object-cover" />
            </motion.div>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6">
               <motion.div variants={fadeInUp} className="glass-panel p-6 rounded-3xl">
                 <h3 className="text-2xl font-bold text-purple-900 mb-2 flex items-center gap-3"><Heart className="text-red-500"/> Misión</h3>
                 <p className="text-gray-700 leading-relaxed text-lg">Brindar apoyo gratuito a personas que necesiten prótesis elaboradas con calidad y materiales adecuados para lograr una mejor calidad de vida.</p>
               </motion.div>
               <motion.div variants={fadeInUp} className="glass-panel p-6 rounded-3xl">
                 <h3 className="text-2xl font-bold text-purple-900 mb-2 flex items-center gap-3"><Users className="text-blue-500"/> Visión</h3>
                 <p className="text-gray-700 leading-relaxed text-lg">Ser reconocidos como líderes en la fabricación de prótesis de alta calidad, así como en la promoción de la empatía en nuestra sociedad.</p>
               </motion.div>
               <motion.div variants={fadeInUp} className="glass-panel p-6 rounded-3xl">
                 <h3 className="text-2xl font-bold text-purple-900 mb-2 flex items-center gap-3"><HandHeart className="text-yellow-500"/> Valores</h3>
                 <p className="text-gray-700 leading-relaxed text-lg">Servicio, Respeto, Empatía, Responsabilidad y Sensibilidad ante las necesidades de los demás.</p>
               </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Como Ayudamos Section */}
      <section id="ayudamos" className="py-24 px-4 bg-white/30 backdrop-blur-xl relative z-10 border-y border-white/60">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col lg:flex-row gap-16 items-center"
          >
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-purple-900">¿Cómo Ayudamos?</h2>
              <p className="text-gray-800 text-xl leading-relaxed font-light">
                Con apoyo de tecnología 3D, fabricamos prótesis adaptativas. Milímetro a milímetro imprimimos, pulimos, armamos y regalamos una mano a la vez.
              </p>
              <ul className="space-y-6">
                {[
                  "Prótesis adaptativas para mejorar la capacidad laboral.",
                  "Impacto ambiental positivo reciclando PET.",
                  "Apoyo a la educación local enseñando impresión 3D a jóvenes.",
                  "Inclusión en nuestros procesos de fabricación."
                ].map((text, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-1 bg-yellow-100 p-2 rounded-full"><HandHeart className="w-5 h-5 text-yellow-600"/></div>
                    <span className="text-gray-800 font-medium text-lg">{text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div className="flex-1 w-full grid grid-cols-2 gap-4 relative">
               <div className="space-y-4 mt-8">
                 <Image src="/images/img2.png" alt="Ayuda 1" width={400} height={400} className="rounded-3xl shadow-lg object-cover h-48 w-full" />
                 <Image src="/images/img3.png" alt="Ayuda 2" width={400} height={400} className="rounded-3xl shadow-lg object-cover h-64 w-full" />
               </div>
               <div className="space-y-4">
                 <Image src="/images/img4.png" alt="Ayuda 3" width={400} height={400} className="rounded-3xl shadow-lg object-cover h-64 w-full" />
                 <div className="glass-panel p-6 rounded-3xl text-center flex flex-col justify-center h-48">
                    <span className="text-4xl font-extrabold text-purple-700 block mb-2">+780k</span>
                    <span className="text-sm font-semibold text-gray-700">Personas con amputaciones en México que nos necesitan</span>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Formulario Section */}
      <section id="solicitud" className="py-24 px-4 relative z-20">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4">Solicitud de Prótesis Gratuita</h2>
            <p className="text-gray-700 text-lg">Completa el formulario. Recuerda que nuestras prótesis son 100% donadas.</p>
          </motion.div>

          <motion.div
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, margin: "-50px" }}
             variants={fadeInUp}
          >
            <RegistrationForm />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-xl border-t border-white/80 pt-16 pb-8 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="Logo" width={32} height={32} className="w-8 h-8 object-contain" />
              <span className="font-bold text-2xl text-purple-900">Manitas para To2</span>
            </div>
            <p className="text-gray-700 max-w-sm text-lg">
              Fundación dedicada a mejorar la calidad de vida a través de prótesis 3D adaptativas gratuitas.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-lg">Contacto</h4>
            <ul className="space-y-3 text-gray-700 font-medium">
              <li className="flex items-center gap-3"><Phone className="w-5 h-5 text-purple-600"/> +52 833 140 6490</li>
              <li className="flex items-center gap-3"><Mail className="w-5 h-5 text-purple-600"/> contacto@manitasparato2.org</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-lg">Síguenos</h4>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-full glass-panel flex items-center justify-center hover:bg-white transition-colors text-blue-600 shadow-sm">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="w-12 h-12 rounded-full glass-panel flex items-center justify-center hover:bg-white transition-colors text-pink-600 shadow-sm">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="text-center text-sm font-medium text-gray-500 pt-8 border-t border-gray-300 flex justify-center items-center gap-4">
          <span>© {new Date().getFullYear()} Fundación Manitas para To2. Todos los derechos reservados.</span>
          <Link href="/admin" className="text-xs opacity-20 hover:opacity-100 transition-opacity">Admin</Link>
        </div>
      </footer>
    </div>
  );
}
