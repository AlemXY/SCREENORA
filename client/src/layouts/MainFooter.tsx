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

const opcionesScreenora = ["Planes", "Novedades", "Dispositivos", "Nosotros"];

const MainFooter = () => {
  return (
    <footer className="relative bg-[#171a37] text-white">
      <div className="h-5 bg-[#070a23]" />

      <div className="mx-auto max-w-[1720px] px-8 pb-14 pt-20 lg:px-14">
        <div className="grid gap-14 lg:grid-cols-2 xl:grid-cols-[1.35fr_0.9fr_1.05fr_0.8fr_0.7fr]">
          {/* Marca y redes sociales */}
          <div>
            <div className="mb-16 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-screenora-purple to-screenora-violet">
                <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>

              <span className="text-3xl font-extrabold tracking-tight">
                Screenora
              </span>
            </div>

            <p className="mb-4 text-sm font-medium text-white">
              Conecta con nosotros
            </p>

            <div className="mb-12 flex items-center gap-4">
              <button
                type="button"
                aria-label="Facebook"
                title="Red social próximamente"
                className="cursor-pointer text-white transition-all duration-300 hover:-translate-y-1 hover:text-screenora-violet"
              >
                <FacebookIcon />
              </button>

              <button
                type="button"
                aria-label="Instagram"
                title="Red social próximamente"
                className="cursor-pointer text-white transition-all duration-300 hover:-translate-y-1 hover:text-screenora-violet"
              >
                <InstagramIcon />
              </button>

              <button
                type="button"
                aria-label="YouTube"
                title="Canal próximamente"
                className="cursor-pointer text-white transition-all duration-300 hover:-translate-y-1 hover:text-screenora-violet"
              >
                <YoutubeIcon />
              </button>
            </div>

            {/* Aplicaciones */}
            <p className="mb-5 text-sm font-medium text-white">
              Descarga la app de Screenora
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                title="Aplicación para iOS próximamente"
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/70 bg-black px-4 py-2 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white"
              >
                <AppleIcon />

                <div>
                  <span className="block text-[9px] leading-none text-white/80">
                    Descárgalo en
                  </span>

                  <span className="text-lg font-semibold leading-tight">
                    App Store
                  </span>
                </div>
              </button>

              <button
                type="button"
                title="Aplicación para Android próximamente"
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/70 bg-black px-4 py-2 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white"
              >
                <PlayStoreIcon />

                <div>
                  <span className="block text-[9px] leading-none text-white/80">
                    Disponible en
                  </span>

                  <span className="text-lg font-semibold leading-tight">
                    Google Play
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Contenidos más vistos */}
          <div>
            <h3 className="mb-7 text-sm font-extrabold">Más vistas</h3>

            <div className="flex flex-col items-start gap-4">
              {masVistas.map((titulo) => (
                <button
                  key={titulo}
                  type="button"
                  title={`Próximamente: ${titulo}`}
                  className="cursor-pointer text-sm text-white/75 transition-colors duration-300 hover:text-screenora-violet"
                >
                  {titulo}
                </button>
              ))}
            </div>
          </div>

          {/* Géneros */}
          <div>
            <h3 className="mb-7 text-sm font-extrabold">Géneros</h3>

            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              {generos.map((genero) => (
                <button
                  key={genero}
                  type="button"
                  title={`Próximamente: ${genero}`}
                  className="cursor-pointer text-left text-sm text-white/75 transition-colors duration-300 hover:text-screenora-violet"
                >
                  {genero}
                </button>
              ))}
            </div>
          </div>

          {/* Ayuda */}
          <div>
            <h3 className="mb-7 text-sm font-extrabold">Ayuda</h3>

            <div className="flex flex-col items-start gap-4">
              {opcionesAyuda.map((opcion) => (
                <button
                  key={opcion}
                  type="button"
                  title={`${opcion}: próximamente`}
                  className="cursor-pointer text-sm text-white/75 transition-colors duration-300 hover:text-screenora-violet"
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>

          {/* Información de Screenora */}
          <div>
            <h3 className="mb-7 text-sm font-extrabold">Screenora</h3>

            <div className="flex flex-col items-start gap-4">
              {opcionesScreenora.map((opcion) => (
                <button
                  key={opcion}
                  type="button"
                  title={`${opcion}: próximamente`}
                  className="cursor-pointer text-sm text-white/75 transition-colors duration-300 hover:text-screenora-violet"
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Información legal */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1720px] flex-col gap-5 px-8 py-7 text-sm text-white/75 md:flex-row md:items-center md:justify-between lg:px-14">
          <p>Copyright © 2026 Screenora. Todos los derechos reservados.</p>

          <div className="flex items-center gap-5">
            <button
              type="button"
              title="Política de privacidad próximamente"
              className="cursor-pointer transition-colors duration-300 hover:text-white"
            >
              Política de privacidad
            </button>

            <button
              type="button"
              title="Términos de servicio próximamente"
              className="cursor-pointer transition-colors duration-300 hover:text-white"
            >
              Términos de servicio
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
