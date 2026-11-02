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
      className="bg-screenora-bg px-6 py-14 lg:px-10 xl:px-9"
    >
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-white">Nuevos estrenos</h2>

        <button
          type="button"
          title="Próximamente: explorar todos los estrenos"
          className="flex cursor-pointer items-center gap-2 text-sm font-bold text-white transition-opacity duration-300 hover:opacity-70"
        >
          Ver todas
          <span className="text-xl">›</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {estrenos.map((estreno) => (
          <article key={estreno.titulo} className="group cursor-pointer">
            <div className="relative aspect-2/3 overflow-hidden rounded-xl bg-white/5">
              <img
                src={estreno.imagen}
                alt={`Póster de ${estreno.titulo}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />

              <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25" />

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                <button
                  type="button"
                  aria-label={`Ver ${estreno.titulo}`}
                  title="Próximamente: reproducir contenido completo"
                  className="pointer-events-auto flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-black/0 text-white backdrop-blur-sm transition-all duration-300 ease-in-out hover:scale-110 hover:bg-black/45"
                >
                  <PlayIcon />
                </button>
              </div>

              <button
                type="button"
                title="Próximamente: añadir a mi lista"
                className="absolute bottom-0 left-0 w-full translate-y-full cursor-pointer bg-white/20 px-4 py-4 text-center text-sm font-semibold text-white backdrop-blur-md transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0"
              >
                Añadir a mi lista
              </button>
            </div>

            <div className="pt-4">
              <h3 className="text-[17px] font-extrabold text-white transition-colors duration-300 group-hover:text-screenora-violet">
                {estreno.titulo}
              </h3>

              <div className="mt-5 flex items-center justify-between gap-3 text-[15px] text-white/65">
                <span>
                  {estreno.año} · {estreno.duracion}
                </span>

                <span className="shrink-0 rounded-md bg-white/10 px-2 py-1 text-xs font-bold text-white">
                  {estreno.clasificacion}
                </span>
              </div>

              <p className="mt-2 text-[15px] text-white/65">
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
