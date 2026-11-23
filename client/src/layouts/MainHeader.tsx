import { useReducer, type KeyboardEvent } from "react";
import { Link } from "react-router";

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

const enlacesNavegacion = [
  { nombre: "Inicio", ruta: "/" },
  { nombre: "Directores", ruta: "/directores" },
  { nombre: "Catálogo", ruta: "/catalogo" },
  { nombre: "Películas", ruta: "/#peliculas" },
  { nombre: "Series", ruta: "/#series" },
];

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
    className="h-5 w-5"
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

  const manejarTeclado = (evento: KeyboardEvent<HTMLElement>) => {
    if (evento.key === "Escape" && menuAbierto) {
      cerrarMenu();
    }
  };

  return (
    <header
      onKeyDown={manejarTeclado}
      className="absolute left-0 top-0 z-50 w-full border-b border-white/10 bg-[#080b1d]/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-20 w-full max-w-screen-2xl items-center px-4 sm:px-6 lg:px-10 xl:px-14">
        <Link
          to="/"
          onClick={cerrarMenu}
          className="flex shrink-0 items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-screenora-purple to-screenora-violet shadow-lg shadow-screenora-purple/20">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>

          <span className="text-xl font-extrabold tracking-[0.04em] text-white sm:text-2xl">
            SCREENORA
          </span>
        </Link>

        <nav
          aria-label="Navegación principal"
          className="ml-8 hidden items-center gap-5 lg:flex xl:ml-12 xl:gap-7"
        >
          {enlacesNavegacion.map((item) => (
            <Link
              key={item.ruta}
              to={item.ruta}
              className="whitespace-nowrap text-sm font-semibold text-white/80 transition-colors duration-300 hover:text-screenora-purple"
            >
              {item.nombre}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:gap-4 xl:gap-6">
          <div className="hidden h-10 w-64 items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 transition-colors duration-300 focus-within:border-screenora-purple xl:flex">
            <SearchIcon />
            <input
              type="search"
              aria-label="Buscar películas y series"
              placeholder="Buscar películas y series..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
            />
          </div>

          <button
            type="button"
            title="Selector de idioma próximamente"
            className="hidden cursor-pointer items-center gap-2 text-white/80 transition-colors hover:text-white xl:flex"
          >
            <GlobeIcon />
            <span className="text-sm font-semibold">ES</span>
            <ChevronIcon />
          </button>

          <CuentaUsuario icon={<UserIcon />} />

          <button
            type="button"
            title="Suscripciones próximamente"
            className="hidden cursor-pointer rounded-full bg-linear-to-r from-screenora-purple to-screenora-violet px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-screenora-purple/20 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 lg:block"
          >
            Suscribirse
          </button>

          <button
            type="button"
            onClick={alternarMenu}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
            aria-controls="screenora-menu-movil"
            className="flex cursor-pointer items-center justify-center text-white transition-colors hover:text-screenora-purple lg:hidden"
          >
            {menuAbierto ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div
        id="screenora-menu-movil"
        aria-hidden={!menuAbierto}
        inert={!menuAbierto}
        className={`overflow-hidden px-4 transition-all duration-300 ease-in-out sm:px-6 lg:hidden ${
          menuAbierto
            ? "max-h-[36rem] translate-y-0 opacity-100"
            : "pointer-events-none max-h-0 -translate-y-3 opacity-0"
        }`}
      >
        <div className="rounded-2xl border border-white/10 bg-[#10152f]/95 p-5 shadow-2xl backdrop-blur-xl">
          <div className="mb-5 flex h-12 items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4">
            <SearchIcon />
            <input
              type="search"
              aria-label="Buscar películas y series"
              placeholder="Buscar películas y series..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
            />
          </div>

          <nav aria-label="Navegación móvil" className="flex flex-col">
            {enlacesNavegacion.map((item) => (
              <Link
                key={item.ruta}
                to={item.ruta}
                onClick={cerrarMenu}
                className="flex items-center justify-between border-b border-white/10 py-4 text-sm font-semibold text-white/80 transition-colors hover:text-screenora-purple"
              >
                {item.nombre}
                <ChevronIcon />
              </Link>
            ))}
          </nav>

          <div className="mt-4 flex items-center justify-between pt-3">
            <button
              type="button"
              title="Selector de idioma próximamente"
              className="flex cursor-pointer items-center gap-2 text-white/80"
            >
              <GlobeIcon />
              <span className="text-sm font-semibold">ES</span>
              <ChevronIcon />
            </button>

            <button
              type="button"
              title="Suscripciones próximamente"
              className="cursor-pointer rounded-full bg-linear-to-r from-screenora-purple to-screenora-violet px-6 py-3 text-sm font-bold text-white shadow-lg"
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
