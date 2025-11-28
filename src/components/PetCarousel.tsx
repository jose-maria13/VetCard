"use client";

import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, useRef, useId, useEffect } from "react";
import { Heart } from "lucide-react";
import Image from "next/image";
import { getSpeciesLabel } from "@/lib/pet-utils";

interface Pet {
  id: string;
  name: string;
  species: string;
  photo_url: string | null;
  created_at: string;
}

interface SlideProps {
  pet: Pet;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
}


const Slide = ({ pet, index, current, handleSlideClick }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);

  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[70vmin] h-[70vmin] mx-[4vmin] z-10 cursor-pointer"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            current !== index
              ? "scale(0.98) rotateX(8deg)"
              : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/90 to-purple-900/90 dark:from-indigo-950 dark:to-purple-950 rounded-[2%] overflow-hidden transition-all duration-150 ease-out shadow-2xl"
          style={{
            transform:
              current === index
                ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)"
                : "none",
          }}
        >
          {pet.photo_url ? (
            <Image
              className="absolute inset-0 w-[120%] h-[120%] object-cover opacity-100 transition-opacity duration-600 ease-in-out"
              style={{
                opacity: current === index ? 1 : 0.5,
              }}
              alt={pet.name}
              src={pet.photo_url}
              fill
              sizes="(max-width: 640px) 70vmin, (max-width: 1024px) 70vmin, 70vmin"
              onLoad={imageLoaded}
              loading="eager"
              priority={index === 0}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-600/40 to-purple-600/40 flex items-center justify-center">
              <Heart className="h-32 w-32 text-white/60" />
            </div>
          )}
          {current === index && (
            <div className="absolute inset-0 bg-black/30 transition-all duration-1000" />
          )}
        </div>

        <article
          className={`relative p-[4vmin] transition-opacity duration-1000 ease-in-out ${current === index ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
        >
          <h2 className="text-lg md:text-2xl lg:text-4xl font-bold relative mb-2">
            {pet.name}
          </h2>
          <p className="text-base md:text-lg lg:text-xl mb-4 opacity-90">
            {getSpeciesLabel(pet.species)}
          </p>
          <div className="text-sm md:text-base opacity-75">
            Miembro desde {new Date(pet.created_at).getFullYear()}
          </div>
        </article>
      </li>
    </div>
  );
};

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({
  type,
  title,
  handleClick,
}: CarouselControlProps) => {
  return (
    <button
      className={`w-10 h-10 flex items-center mx-2 justify-center bg-white dark:bg-slate-800 border-2 border-transparent rounded-full focus:border-indigo-600 focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 shadow-lg ${type === "previous" ? "rotate-180" : ""
        }`}
      title={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight className="text-slate-700 dark:text-slate-200" />
    </button>
  );
};

interface PetCarouselProps {
  pets: Pet[];
}

export default function PetCarousel({ pets }: PetCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || pets.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % pets.length);
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval);
  }, [isAutoPlaying, pets.length]);

  const handlePreviousClick = () => {
    const previous = current - 1;
    setCurrent(previous < 0 ? pets.length - 1 : previous);
    setIsAutoPlaying(false); // Pausar autoplay al navegar manualmente
  };

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === pets.length ? 0 : next);
    setIsAutoPlaying(false); // Pausar autoplay al navegar manualmente
  };

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
      setIsAutoPlaying(false); // Pausar autoplay al hacer clic
    }
  };

  const id = useId();

  if (pets.length === 0) return null;

  return (
    <div
      className="relative w-full max-w-[min(70vmin,400px)] sm:max-w-[70vmin] h-[min(70vmin,400px)] sm:h-[70vmin] mx-auto"
      aria-labelledby={`carousel-heading-${id}`}
    >
      <ul
        className="absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${current * (100 / pets.length)}%)`,
        }}
      >
        {pets.map((pet, index) => (
          <Slide
            key={pet.id}
            pet={pet}
            index={index}
            current={current}
            handleSlideClick={handleSlideClick}
          />
        ))}
      </ul>

      <div className="absolute flex justify-center w-full top-[calc(100%+1rem)]">
        <CarouselControl
          type="previous"
          title="Ir a la mascota anterior"
          handleClick={handlePreviousClick}
        />

        <CarouselControl
          type="next"
          title="Ir a la siguiente mascota"
          handleClick={handleNextClick}
        />
      </div>

      {/* Play/Pause Button */}
      {pets.length > 1 && (
        <div className="absolute flex justify-center w-full top-[calc(100%+4rem)]">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            {isAutoPlaying ? '⏸️ Pausar' : '▶️ Reproducir'}
          </button>
        </div>
      )}
    </div>
  );
}
