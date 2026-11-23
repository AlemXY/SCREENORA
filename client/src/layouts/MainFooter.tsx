import { Link } from "react-router";

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M13.5 22v-9h3l.45-3.5H13.5V7.25c0-1.01.28-1.7 1.74-1.7H17.1V2.42c-.32-.04-1.42-.14-2.7-.14-2.67 0-4.5 1.63-4.5 4.63V9.5H7v3.5h2.9v9h3.6Z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M23 12s0-3.5-.45-5.18a2.9 2.9 0 0 0-2.04-2.04C18.82 4.33 12 4.33 12 4.33s-6.82 0-8.51.45a2.9 2.9 0 0 0-2.04 2.04C1 8.5 1 12 1 12s0 3.5.45 5.18a2.9 2.9 0 0 0 2.04 2.04c1.69.45 8.51.45 8.51.45s6.82 0 8.51-.45a2.9 2.9 0 0 0 2.04-2.04C23 15.5 23 12 23 12Zm-13.25 3.2V8.8L15.5 12l-5.75 3.2Z" />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.79 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09ZM12.03 7.25C11.88 5.02 13.69 3.18 15.77 3c.29 2.58-2.34 4.5-3.74 4.25Z" />
  </svg>
);

const PlayStoreIcon = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
    <path d="M3.61 2.22 14.5 12 3.62 21.78A2 2 0 0 1 3 20.32V3.68c0-.56.23-1.07.61-1.46Zm12.12 10.89 2.63 2.36-11.19 6.27 8.56-8.63Zm3.9-5.2c.85.48 1.37 1.27 1.37 2.09s-.52 1.61-1.37 2.09l-2.48 1.39-2.89-2.6 2.89-2.59 2.48 1.38ZM7.17 2.26l11.19 6.27-2.63 2.36-8.56-8.63Z" />
  </svg>
);

const masVistas = [
  "Obsession",
  "Whiplash",
  "Better Call Saul",
  "Breaking Bad",
  "The Last of Us",
];

const generos = [
  "Romance",
  "Terror",
  "Drama",
  "Anime",
  "Familia",
  "Suspenso",
  "Comedia",
  "Historia",
  "Acción",
  "Ciencia ficción",
  "Aventura",
];

const opcionesAyuda = [
  "Mi cuenta",
  "Soporte",
  "Contáctanos",
  "Preguntas frecuentes",
  "Empleos",
];

const MainFooter = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#080b1d] text-white">
      <div className="absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-screenora-purple/70 to-transparent" />

      <div className="mx-auto max-w-screen-2xl px-5 pb-10 pt-14 sm:px-8 lg:px-12 lg:pb-12 lg:pt-16">
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.45fr_0.85fr_1.1fr_0.85fr_0.85fr]">
          <div>
            <Link to="/" className="mb-7 inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-screenora-purple to-screenora-violet shadow-lg shadow-screenora-purple/20">
                <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>

              <span className="text-2xl font-extrabold tracking-[0.04em]">
                SCREENORA
              </span>
            </Link>

            <p className="mb-6 max-w-xs text-sm leading-6 text-white/55">
              Descubre películas y series. Encuentra tu próxima historia
              favorita en SCREENORA.
            </p>

            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-white/75">
              Conecta con nosotros
            </p>

            <div className="mb-9 flex items-center gap-3">
              <button
                type="button"
                disabled
                aria-label="Facebook próximamente"
                title="Facebook próximamente"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition-all duration-300 hover:border-screenora-purple hover:bg-screenora-purple hover:text-white disabled:cursor-not-allowed"
              >
                <FacebookIcon />
              </button>

              <button
                type="button"
                disabled
                aria-label="Instagram próximamente"
                title="Instagram próximamente"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition-all duration-300 hover:border-screenora-purple hover:bg-screenora-purple hover:text-white disabled:cursor-not-allowed"
              >
                <InstagramIcon />
              </button>

              <button
                type="button"
                disabled
                aria-label="YouTube próximamente"
                title="YouTube próximamente"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition-all duration-300 hover:border-screenora-purple hover:bg-screenora-purple hover:text-white disabled:cursor-not-allowed"
              >
                <YoutubeIcon />
              </button>
            </div>

            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-white/75">
              Próximamente en tu dispositivo
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled
                title="Aplicación para iOS próximamente"
                className="flex cursor-not-allowed items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-left text-white/65"
              >
                <AppleIcon />
                <span>
                  <span className="block text-[9px]">Descárgalo en</span>
                  <span className="text-sm font-bold">App Store</span>
                </span>
              </button>

              <button
                type="button"
                disabled
                title="Aplicación para Android próximamente"
                className="flex cursor-not-allowed items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-left text-white/65"
              >
                <PlayStoreIcon />
                <span>
                  <span className="block text-[9px]">Disponible en</span>
                  <span className="text-sm font-bold">Google Play</span>
                </span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-extrabold tracking-wide text-white">
              MÁS VISTAS
            </h3>

            <div className="flex flex-col items-start gap-4">
              {masVistas.map((titulo) => (
                <span
                  key={titulo}
                  className="text-sm text-white/55 transition-colors duration-300 hover:text-white"
                >
                  {titulo}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-extrabold tracking-wide text-white">
              GÉNEROS
            </h3>

            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
              {generos.map((genero) => (
                <span
                  key={genero}
                  className="text-sm text-white/55 transition-colors duration-300 hover:text-white"
                >
                  {genero}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-extrabold tracking-wide text-white">
              AYUDA
            </h3>

            <div className="flex flex-col items-start gap-4">
              {opcionesAyuda.map((opcion) => (
                <span
                  key={opcion}
                  className="text-sm text-white/55 transition-colors duration-300 hover:text-white"
                >
                  {opcion}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-extrabold tracking-wide text-white">
              SCREENORA
            </h3>

            <div className="flex flex-col items-start gap-4">
              <Link
                to="/"
                className="text-sm text-white/55 transition-colors duration-300 hover:text-screenora-purple"
              >
                Inicio
              </Link>

              <Link
                to="/directores"
                className="text-sm text-white/55 transition-colors duration-300 hover:text-screenora-purple"
              >
                Directores
              </Link>

              <Link
                to="/catalogo"
                className="text-sm text-white/55 transition-colors duration-300 hover:text-screenora-purple"
              >
                Catálogo
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#060817]">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-5 py-6 text-xs text-white/45 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <p>Copyright © 2026 SCREENORA. Todos los derechos reservados.</p>

          <div className="flex flex-wrap items-center gap-5">
            <span>Política de privacidad</span>
            <span>Términos de servicio</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
