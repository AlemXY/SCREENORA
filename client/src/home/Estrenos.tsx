import { Link } from "react-router";

import obsession from "../assets/estrenos/obsession.jpg";
import whiplash from "../assets/estrenos/whiplash.jpg";
import betterCallSaul from "../assets/estrenos/better-call-saul.jpg";
import ovejasDetectives from "../assets/estrenos/ovejas-detectives.jpg";
import theBoys from "../assets/estrenos/the-boys.jpg";
import arcane from "../assets/estrenos/arcane.jpg";
import goodfellas from "../assets/estrenos/goodfellas.jpg";
import dark from "../assets/estrenos/dark.jpg";

const estrenos = [
  {
    titulo: "Obsession",
    año: "2026",
    duracion: "108 min",
    clasificacion: "R",
    generos: "Terror · Suspenso",
    imagen: obsession,
  },
  {
    titulo: "Whiplash",
    año: "2014",
    duracion: "106 min",
    clasificacion: "R",
    generos: "Drama · Música",
    imagen: whiplash,
  },
  {
    titulo: "Better Call Saul",
    año: "2015",
    duracion: "46 min",
    clasificacion: "TV-MA",
    generos: "Drama · Crimen",
    imagen: betterCallSaul,
  },
  {
    titulo: "Las ovejas detectives",
    año: "2026",
    duracion: "100 min",
    clasificacion: "PG",
    generos: "Comedia · Misterio",
    imagen: ovejasDetectives,
  },
  {
    titulo: "The Boys",
    año: "2019",
    duracion: "60 min",
    clasificacion: "TV-MA",
    generos: "Acción · Drama",
    imagen: theBoys,
  },
  {
    titulo: "Arcane",
    año: "2021",
    duracion: "40 min",
    clasificacion: "TV-14",
    generos: "Animación · Acción",
    imagen: arcane,
  },
  {
    titulo: "Goodfellas",
    año: "1990",
    duracion: "146 min",
    clasificacion: "R",
    generos: "Crimen · Drama",
    imagen: goodfellas,
  },
  {
    titulo: "Dark",
    año: "2017",
    duracion: "60 min",
    clasificacion: "TV-MA",
    generos: "Misterio · Ciencia ficción",
    imagen: dark,
  },
];

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-current">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const Estrenos = () => {
  return (
    <section
      id="estrenos"
      className="bg-[#080b1d] px-5 py-14 sm:px-8 lg:px-12 xl:px-16"
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-screenora-violet sm:text-xs">
            Descubre nuevas historias
          </p>

          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Nuevos estrenos
          </h2>

          <p className="mt-2 text-sm text-white/45">
            Explora películas y series que no te puedes perder.
          </p>
        </div>

        <Link
          to="/catalogo"
          className="flex w-fit items-center gap-2 text-sm font-bold text-white/75 transition-colors duration-300 hover:text-screenora-violet"
        >
          Ver catálogo completo
          <span className="text-xl">›</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {estrenos.map((estreno) => (
          <article key={estreno.titulo} className="group flex min-w-0 flex-col">
            <figure className="relative aspect-2/3 overflow-hidden rounded-2xl border border-white/10 bg-[#10152b] shadow-lg shadow-black/10 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:border-screenora-purple/50 group-hover:shadow-xl group-hover:shadow-screenora-purple/10">
              <img
                src={estreno.imagen}
                alt={`Póster de ${estreno.titulo}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#080b1d]/90 via-transparent to-black/10" />

              <span className="absolute left-3 top-3 rounded-md border border-white/15 bg-[#080b1d]/75 px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur-md">
                {estreno.año}
              </span>

              <span className="absolute right-3 top-3 rounded-md bg-black/65 px-2 py-1.5 text-[10px] font-bold text-white backdrop-blur-md">
                {estreno.clasificacion}
              </span>

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-black/40 text-white shadow-xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  <PlayIcon />
                </span>
              </div>

              <button
                type="button"
                disabled
                title="Próximamente: añadir a mi lista"
                className="absolute bottom-0 left-0 w-full translate-y-full cursor-not-allowed border-t border-white/10 bg-[#080b1d]/85 px-3 py-3.5 text-center text-xs font-bold text-white backdrop-blur-md transition-transform duration-300 ease-out group-hover:translate-y-0"
              >
                Añadir a mi lista
              </button>
            </figure>

            <div className="flex flex-1 flex-col px-1 pt-4">
              <h3 className="line-clamp-2 min-h-12 text-base font-extrabold leading-6 text-white transition-colors duration-300 group-hover:text-screenora-violet sm:text-lg">
                {estreno.titulo}
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-white/50">
                <span>{estreno.año}</span>
                <span className="h-1 w-1 rounded-full bg-white/30" />
                <span>{estreno.duracion}</span>
              </div>

              <p className="mt-2 line-clamp-1 text-sm text-white/45">
                {estreno.generos}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Estrenos;
