"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowRight, PlayCircle } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/slide1.png",
    title: "L'éducation réinventée pour l'excellence.",
    description:
      "Bienvenue à SAIMO, l'environnement idéal pour l'épanouissement et la réussite de chaque élève.",
  },
  {
    id: 2,
    image: "/slide2.png",
    title: "Au cœur de l'apprentissage.",
    description:
      "Nos équipes pédagogiques s'engagent à offrir un suivi régulier et adapté au rythme de votre enfant.",
  },
  {
    id: 3,
    image: "/slide3.png",
    title: "Connectez la famille et l'école.",
    description:
      "Restez toujours informé de la vie scolaire, des résultats et des événements grâce à un portail simple et accessible.",
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Text Animation when slide changes
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".slide-content",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1 }
      );
    }, textRef);

    return () => ctx.revert();
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    if (timerRef.current) clearInterval(timerRef.current);
    // Restart auto-play
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
  };

  return (
    <section id="top" className="relative min-h-[90vh] flex items-center overflow-hidden bg-navy-950">
      {/* Background Images with Crossfade */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          style={{
            backgroundImage: `url('${slide.image}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay so text is readable */}
          <div className="absolute inset-0 bg-navy-950/60" />
        </div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 w-full mx-auto grid max-w-7xl px-6 py-24 md:items-center xl:px-8">
        <div className="max-w-2xl" ref={textRef}>
          <h1 className="slide-content font-display text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {slides[currentSlide].title}
          </h1>

          <p className="slide-content mt-8 text-xl leading-relaxed text-white/90">
            {slides[currentSlide].description}
          </p>

          <div className="slide-content mt-10 flex flex-wrap items-center gap-5">
            <a
              href="#preinscription"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-orange-400 px-8 py-4 text-base font-bold text-white transition-all hover:opacity-90 hover:scale-105 shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)]"
            >
              Préinscrire mon enfant
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="/school"
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <PlayCircle className="h-5 w-5" />
              Découvrir SAIMO
            </a>
          </div>
        </div>
      </div>

      {/* Slide Indicators (Dots) */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? "w-10 bg-gradient-to-r from-blue-500 to-orange-400" : "w-2.5 bg-white/40 hover:bg-white/70"
              }`}
          />
        ))}
      </div>
    </section>
  );
}
