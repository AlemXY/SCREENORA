import { useReducer } from "react";

import CuentaUsuario from "../components/CuentaUsuario";

type AccionMenu = "ALTERNAR" | "CERRAR";

const reducerMenu = (abierto: boolean, accion: AccionMenu): boolean => {
  switch (accion) {
    case "ALTERNAR":
      return !abierto;

    case "CERRAR":
      return false;

    default:
      return abierto;
  }
};

const ChevronIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const GlobeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9" />
    <path d="M12 3c-2.5 2.5-4 5.5-4 9s1.5 6.5 4 9" />
  </svg>
);

const UserIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 21c.8-4 3.3-6 7.5-6s6.7 2 7.5 6" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const MenuIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-7 w-7"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </svg>
);

const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-7 w-7"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M6 6l12 12" />
    <path d="M18 6 6 18" />
  </svg>
);

const MainHeader = () => {
  const [menuAbierto, dispatchMenu] = useReducer(reducerMenu, false);

  const alternarMenu = () => {
    dispatchMenu("ALTERNAR");
  };

  const cerrarMenu = () => {
    dispatchMenu("CERRAR");
  };

  const manejarTeclado = (evento: React.KeyboardEvent<HTMLElement>) => {
    if (evento.key === "Escape" && menuAbierto) {
      cerrarMenu();
    }
  };

  return (
    <header
      onKeyDown={manejarTeclado}
      className="absolute left-0 top-0 z-50 w-full"
    >
      <div className="flex h-19 w-full items-center px-4 sm:px-6 lg:px-10 xl:px-16">
        {/* Logo */}
        <a
          href="#inicio"
          onClick={cerrarMenu}
          className="flex shrink-0 items-center gap-2 sm:gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-screenora-purple to-screenora-violet shadow-lg sm:h-10 sm:w-10">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>

          <span className="text-[22px] font-extrabold tracking-[-0.03em] text-white sm:text-[27px]">
            Screenora
          </span>
        </a>

        {/* Navegación de escritorio */}
        <nav
          aria-label="Navegación principal"
          className="ml-8 hidden items-center gap-5 lg:flex xl:ml-14 xl:gap-8"
        >
          <a
            href="#inicio"
            className="flex items-center gap-1 text-[15px] font-bold text-white transition-opacity duration-300 hover:opacity-70"
          >
            Inicio
            <ChevronIcon />
          </a>

          <a
            href="#peliculas"
            className="flex items-center gap-1 text-[15px] font-bold text-white transition-opacity duration-300 hover:opacity-70"
          >
            Películas
            <ChevronIcon />
          </a>

          <a
            href="#series"
            className="flex items-center gap-1 text-[15px] font-bold text-white transition-opacity duration-300 hover:opacity-70"
          >
            Series
            <ChevronIcon />
          </a>

          <a
            href="#generos"
            className="flex items-center gap-1 text-[15px] font-bold text-white transition-opacity duration-300 hover:opacity-70"
          >
            Más
            <ChevronIcon />
          </a>
        </nav>

        {/* Acciones de escritorio */}
        <div className="ml-auto flex items-center gap-3 lg:gap-5">
          <div className="hidden h-11.25 w-[320px] items-center gap-3 rounded-xl border border-white/20 bg-black/10 px-4 backdrop-blur-sm xl:flex">
            <SearchIcon />

            <input
              type="search"
              aria-label="Buscar películas y series"
              placeholder="Buscar películas, series y más..."
              className="w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/80"
            />
          </div>

          <button
            type="button"
            title="Selector de idioma próximamente"
            className="hidden cursor-pointer items-center gap-2 text-white lg:flex"
          >
            <GlobeIcon />
            <span className="text-sm font-bold">ES</span>
            <ChevronIcon />
          </button>

          <CuentaUsuario icon={<UserIcon />} />

          <button
            type="button"
            title="Suscripciones próximamente"
            className="hidden cursor-pointer rounded-xl bg-linear-to-r from-screenora-purple to-screenora-violet px-6 py-3 text-[15px] font-bold text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5 lg:block xl:px-9"
          >
            Suscribirse
          </button>

          {/* Botón de menú móvil */}
          <button
            type="button"
            onClick={alternarMenu}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
            aria-controls="screenora-menu-movil"
            className="flex cursor-pointer items-center justify-center text-white lg:hidden"
          >
            {menuAbierto ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Menú desplegable móvil */}
      <div
        id="screenora-menu-movil"
        aria-hidden={!menuAbierto}
        inert={!menuAbierto}
        className={`overflow-hidden px-4 transition-all duration-300 ease-in-out sm:px-6 lg:hidden ${
          menuAbierto
            ? "max-h-150 translate-y-0 opacity-100"
            : "pointer-events-none max-h-0 -translate-y-3 opacity-0"
        }`}
      >
        <div className="rounded-2xl border border-white/10 bg-[#11152e]/95 p-5 shadow-2xl backdrop-blur-xl">
          {/* Buscador móvil */}
          <div className="mb-5 flex h-12 items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4">
            <SearchIcon />

            <input
              type="search"
              aria-label="Buscar películas y series"
              placeholder="Buscar películas, series y más..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/50"
            />
          </div>

          {/* Navegación móvil */}
          <nav aria-label="Navegación móvil" className="flex flex-col">
            <a
              href="#inicio"
              onClick={cerrarMenu}
              className="flex items-center justify-between border-b border-white/10 py-4 text-sm font-bold text-white"
            >
              Inicio
              <ChevronIcon />
            </a>

            <a
              href="#peliculas"
              onClick={cerrarMenu}
              className="flex items-center justify-between border-b border-white/10 py-4 text-sm font-bold text-white"
            >
              Películas
              <ChevronIcon />
            </a>

            <a
              href="#series"
              onClick={cerrarMenu}
              className="flex items-center justify-between border-b border-white/10 py-4 text-sm font-bold text-white"
            >
              Series
              <ChevronIcon />
            </a>

            <a
              href="#generos"
              onClick={cerrarMenu}
              className="flex items-center justify-between py-4 text-sm font-bold text-white"
            >
              Más
              <ChevronIcon />
            </a>
          </nav>

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-5">
            <button
              type="button"
              title="Selector de idioma próximamente"
              className="flex cursor-pointer items-center gap-2 text-white"
            >
              <GlobeIcon />
              <span className="text-sm font-bold">ES</span>
              <ChevronIcon />
            </button>

            <button
              type="button"
              title="Suscripciones próximamente"
              className="cursor-pointer rounded-xl bg-linear-to-r from-screenora-purple to-screenora-violet px-6 py-3 text-sm font-bold text-white shadow-lg"
            >
              Suscribirse
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
