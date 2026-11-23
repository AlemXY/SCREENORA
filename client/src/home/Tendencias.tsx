import { useReducer, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";

import obsession from "../assets/banner/obsession.jpg";
import obsessionVideo from "../assets/banner/videos/obsession.mp4";
import whiplash from "../assets/banner/whiplash.jpg";
import whiplashVideo from "../assets/banner/videos/whiplash.mp4";
import betterCallSaul from "../assets/banner/better-call-saul.jpg";
import betterCallSaulVideo from "../assets/banner/videos/better-call-saul.mp4";
import ovejasDetectives from "../assets/banner/ovejas-detectives.jpg";
import ovejasDetectivesVideo from "../assets/banner/videos/ovejas-detectives.mp4";
import theBoys from "../assets/banner/the-boys.jpg";
import theBoysVideo from "../assets/banner/videos/the-boys.mp4";
import arcane from "../assets/banner/arcane.jpg";
import arcaneVideo from "../assets/banner/videos/arcane.mp4";
import goodfellas from "../assets/banner/goodfellas.jpg";
import goodfellasVideo from "../assets/banner/videos/goodfellas.mp4";
import dark from "../assets/banner/dark.jpg";
import darkVideo from "../assets/banner/videos/dark.mp4";

const peliculas = [
  {
    titulo: "Obsession",
    generos: "Terror · Suspenso",
    generosDetalle: "Terror · Suspenso · Misterio",
    puntuacion: "9.4",
    año: "2026",
    duracion: "108 min",
    clasificacion: "R",
    imagen: obsession,
    video: obsessionVideo,
    etiquetas: ["4K", "HDR"],
  },
  {
    titulo: "Whiplash",
    generos: "Drama · Música",
    generosDetalle: "Drama · Música",
    puntuacion: "8.5",
    año: "2014",
    duracion: "106 min",
    clasificacion: "R",
    imagen: whiplash,
    video: whiplashVideo,
    etiquetas: [],
  },
  {
    titulo: "Better Call Saul",
    generos: "Drama · Crimen",
    generosDetalle: "Drama · Crimen · Thriller",
    puntuacion: "9.0",
    año: "2015",
    duracion: "46 min",
    clasificacion: "TV-MA",
    imagen: betterCallSaul,
    video: betterCallSaulVideo,
    etiquetas: ["NEW", "Sub"],
  },
  {
    titulo: "Las ovejas detectives",
    generos: "Comedia · Misterio",
    generosDetalle: "Comedia · Misterio · Aventura",
    puntuacion: "8.1",
    año: "2026",
    duracion: "100 min",
    clasificacion: "PG",
    imagen: ovejasDetectives,
    video: ovejasDetectivesVideo,
    etiquetas: ["NEW"],
  },
  {
    titulo: "The Boys",
    generos: "Acción · Drama",
    generosDetalle: "Acción · Drama · Ciencia ficción",
    puntuacion: "8.6",
    año: "2019",
    duracion: "60 min",
    clasificacion: "TV-MA",
    imagen: theBoys,
    video: theBoysVideo,
    etiquetas: ["4K", "HDR"],
  },
  {
    titulo: "Arcane",
    generos: "Animación · Acción",
    generosDetalle: "Animación · Acción · Fantasía",
    puntuacion: "9.0",
    año: "2021",
    duracion: "40 min",
    clasificacion: "TV-14",
    imagen: arcane,
    video: arcaneVideo,
    etiquetas: ["4K"],
  },
  {
    titulo: "Goodfellas",
    generos: "Crimen · Drama",
    generosDetalle: "Crimen · Drama · Biografía",
    puntuacion: "8.7",
    año: "1990",
    duracion: "146 min",
    clasificacion: "R",
    imagen: goodfellas,
    video: goodfellasVideo,
    etiquetas: ["4K"],
  },
  {
    titulo: "Dark",
    generos: "Misterio · Drama",
    generosDetalle: "Misterio · Drama · Ciencia ficción",
    puntuacion: "8.7",
    año: "2017",
    duracion: "60 min",
    clasificacion: "TV-MA",
    imagen: dark,
    video: darkVideo,
    etiquetas: ["HDR", "Sub"],
  },
];

type Pelicula = (typeof peliculas)[number];

type Posicion = {
  top: number;
  left: number;
  width: number;
};

type EstadoTarjeta = {
  abierto: boolean;
  visible: boolean;
  cargarVideo: boolean;
  reproduciendo: boolean;
  silenciado: boolean;
  posicion: Posicion;
};

type AccionTarjeta =
  | { type: "ABRIR"; posicion: Posicion }
  | { type: "MOSTRAR" }
  | { type: "OCULTAR" }
  | { type: "CERRAR" }
  | { type: "CARGAR_VIDEO" }
  | { type: "REPRODUCIENDO" }
  | { type: "TERMINAR_VIDEO" }
  | { type: "CAMBIAR_SONIDO" };

const estadoInicial: EstadoTarjeta = {
  abierto: false,
  visible: false,
  cargarVideo: false,
  reproduciendo: false,
  silenciado: true,
  posicion: { top: 0, left: 0, width: 430 },
};

const reducerTarjeta = (
  estado: EstadoTarjeta,
  accion: AccionTarjeta,
): EstadoTarjeta => {
  switch (accion.type) {
    case "ABRIR":
      return {
        ...estadoInicial,
        abierto: true,
        posicion: accion.posicion,
      };

    case "MOSTRAR":
      return { ...estado, visible: true };

    case "OCULTAR":
      return { ...estado, visible: false };

    case "CERRAR":
      return { ...estadoInicial };

    case "CARGAR_VIDEO":
      if (!estado.abierto || !estado.visible) {
        return estado;
      }

      return { ...estado, cargarVideo: true };

    case "REPRODUCIENDO":
      return { ...estado, reproduciendo: true };

    case "TERMINAR_VIDEO":
      return {
        ...estado,
        cargarVideo: false,
        reproduciendo: false,
      };

    case "CAMBIAR_SONIDO":
      return {
        ...estado,
        silenciado: !estado.silenciado,
      };

    default:
      return estado;
  }
};

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const BookmarkIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 4h12v16l-6-4-6 4z" />
  </svg>
);

const VolumeOnIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M5 9v6h4l5 4V5L9 9H5z" />
    <path d="M17 8a6 6 0 0 1 0 8" />
  </svg>
);

const VolumeOffIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M5 9v6h4l5 4V5L9 9H5z" />
    <path d="m18 9 4 4" />
    <path d="m22 9-4 4" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const TarjetaTendencia = ({ pelicula }: { pelicula: Pelicula }) => {
  const [estado, dispatch] = useReducer(reducerTarjeta, estadoInicial);

  const tarjetaRef = useRef<HTMLElement>(null);

  const abrirTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cerrarTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const desmontarTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const limpiarTimer = (referencia: {
    current: ReturnType<typeof setTimeout> | null;
  }) => {
    if (referencia.current !== null) {
      clearTimeout(referencia.current);
      referencia.current = null;
    }
  };

  const calcularPosicion = (): Posicion => {
    const rect = tarjetaRef.current?.getBoundingClientRect();

    const margen = 12;
    const ancho = Math.min(430, window.innerWidth - margen * 2);
    const altura = Math.min(500, window.innerHeight - margen * 2);

    const izquierdaIdeal = rect
      ? rect.left + rect.width / 2 - ancho / 2
      : margen;

    const left = Math.max(
      margen,
      Math.min(izquierdaIdeal, window.innerWidth - ancho - margen),
    );

    const top = Math.max(
      margen,
      Math.min(
        (rect?.top ?? margen) - 10,
        window.innerHeight - altura - margen,
      ),
    );

    return { top, left, width: ancho };
  };

  const cancelarCierre = () => {
    limpiarTimer(cerrarTimer);
    limpiarTimer(desmontarTimer);

    if (estado.abierto && !estado.visible) {
      dispatch({ type: "MOSTRAR" });
    }
  };

  const abrirPanel = (inmediato = false) => {
    cancelarCierre();

    if (estado.abierto) {
      return;
    }

    limpiarTimer(abrirTimer);

    const iniciar = () => {
      dispatch({
        type: "ABRIR",
        posicion: calcularPosicion(),
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          dispatch({ type: "MOSTRAR" });
        });
      });

      limpiarTimer(videoTimer);

      videoTimer.current = setTimeout(() => {
        dispatch({ type: "CARGAR_VIDEO" });
        videoTimer.current = null;
      }, 2000);
    };

    if (inmediato) {
      iniciar();
    } else {
      abrirTimer.current = setTimeout(iniciar, 450);
    }
  };

  const cerrarPanel = () => {
    limpiarTimer(abrirTimer);
    limpiarTimer(cerrarTimer);

    if (!estado.abierto) {
      return;
    }

    cerrarTimer.current = setTimeout(() => {
      limpiarTimer(videoTimer);
      dispatch({ type: "OCULTAR" });

      desmontarTimer.current = setTimeout(() => {
        dispatch({ type: "CERRAR" });
        desmontarTimer.current = null;
      }, 300);
    }, 180);
  };

  const cerrarInmediatamente = () => {
    limpiarTimer(abrirTimer);
    limpiarTimer(cerrarTimer);
    limpiarTimer(videoTimer);
    limpiarTimer(desmontarTimer);
    dispatch({ type: "CERRAR" });
  };

  const cambiarSonido = () => {
    dispatch({ type: "CAMBIAR_SONIDO" });
  };

  const terminarVideo = () => {
    dispatch({ type: "TERMINAR_VIDEO" });
  };

  return (
    <>
      <article
        ref={tarjetaRef}
        role="button"
        tabIndex={0}
        aria-label={`Ver vista previa de ${pelicula.titulo}`}
        onMouseEnter={() => abrirPanel()}
        onMouseLeave={cerrarPanel}
        onClick={() => abrirPanel(true)}
        onKeyDown={(evento) => {
          if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            abrirPanel(true);
          }
        }}
        className="group w-72.5 shrink-0 cursor-pointer outline-offset-4 focus-visible:outline-2 focus-visible:outline-screenora-violet"
      >
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-[#10152b] shadow-lg transition-all duration-500 group-hover:-translate-y-1 group-hover:border-screenora-purple/50 group-hover:shadow-xl group-hover:shadow-screenora-purple/10">
          <img
            src={pelicula.imagen}
            alt={`Póster de ${pelicula.titulo}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-linear-to-t from-[#080b1d]/90 via-transparent to-black/10" />

          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {pelicula.etiquetas.map((etiqueta) => (
              <span
                key={etiqueta}
                className={`rounded-md px-2 py-1 text-[10px] font-extrabold text-white ${
                  etiqueta === "HDR"
                    ? "bg-black/80"
                    : etiqueta === "NEW"
                      ? "bg-emerald-600"
                      : etiqueta === "Sub"
                        ? "bg-screenora-purple"
                        : "bg-orange-500"
                }`}
              >
                {etiqueta}
              </span>
            ))}
          </div>

          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur-md">
            <span className="text-sm text-yellow-400">★</span>
            <span className="text-xs font-bold text-white">
              {pelicula.puntuacion}
            </span>
          </div>

          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            {pelicula.año}
          </div>
        </div>

        <div className="px-1 pt-4">
          <h3 className="truncate text-base font-extrabold text-white transition-colors duration-300 group-hover:text-screenora-violet sm:text-lg">
            {pelicula.titulo}
          </h3>

          <p className="mt-1 text-sm text-white/50">{pelicula.generos}</p>
        </div>
      </article>

      {estado.abierto &&
        createPortal(
          <div
            onMouseEnter={cancelarCierre}
            onMouseLeave={cerrarPanel}
            className={`fixed z-999 overflow-y-auto rounded-2xl border border-white/10 bg-[#10152b] shadow-2xl shadow-black/60 transition-all duration-300 ease-out ${
              estado.visible
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-95 opacity-0"
            }`}
            style={{
              top: estado.posicion.top,
              left: estado.posicion.left,
              width: estado.posicion.width,
              maxHeight: "calc(100dvh - 24px)",
            }}
          >
            <div className="relative aspect-video overflow-hidden bg-black">
              <img
                src={pelicula.imagen}
                alt={pelicula.titulo}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
                  estado.reproduciendo ? "opacity-0" : "opacity-100"
                }`}
              />

              {estado.cargarVideo && (
                <video
                  src={pelicula.video}
                  poster={pelicula.imagen}
                  muted={estado.silenciado}
                  autoPlay
                  playsInline
                  preload="none"
                  onPlaying={() => dispatch({ type: "REPRODUCIENDO" })}
                  onEnded={terminarVideo}
                  onError={terminarVideo}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
                    estado.reproduciendo ? "opacity-100" : "opacity-0"
                  }`}
                />
              )}

              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#10152b] via-transparent to-black/20" />

              <button
                type="button"
                onClick={cambiarSonido}
                disabled={!estado.reproduciendo}
                aria-label={
                  estado.silenciado ? "Activar sonido" : "Silenciar tráiler"
                }
                className={`absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#080b1d]/80 text-white backdrop-blur-md transition-all duration-300 ${
                  estado.reproduciendo
                    ? "cursor-pointer hover:bg-screenora-purple"
                    : "cursor-not-allowed opacity-40"
                }`}
              >
                {estado.reproduciendo && !estado.silenciado ? (
                  <VolumeOnIcon />
                ) : (
                  <VolumeOffIcon />
                )}
              </button>
            </div>

            <div className="px-5 pb-6 pt-4 sm:px-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="text-xl font-extrabold text-white">
                  {pelicula.titulo}
                </h3>

                <button
                  type="button"
                  onClick={cerrarInmediatamente}
                  aria-label="Cerrar vista previa"
                  className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/10 text-xl text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="mb-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  title="Próximamente: ver contenido completo"
                  className="flex cursor-pointer items-center gap-2 rounded-full bg-linear-to-r from-screenora-purple to-screenora-violet px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-screenora-purple/20 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
                >
                  <PlayIcon />
                  Ver ahora
                </button>

                <button
                  type="button"
                  title="Próximamente: agregar a mi lista"
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-white transition-colors duration-300 hover:bg-white/10"
                >
                  Mi lista
                  <BookmarkIcon />
                </button>

                <button
                  type="button"
                  title="Próximamente: información detallada"
                  className="cursor-pointer rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-white transition-colors duration-300 hover:bg-white/10"
                >
                  Detalle ⓘ
                </button>
              </div>

              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="rounded-lg border border-yellow-400/40 bg-yellow-400/5 px-3 py-2 text-xs font-bold text-yellow-400">
                  ★ IMDb {pelicula.puntuacion}
                </span>

                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80">
                  {pelicula.clasificacion}
                </span>

                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80">
                  {pelicula.año}
                </span>

                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80">
                  {pelicula.duracion}
                </span>
              </div>

              <p className="text-sm leading-6 text-white/60">
                {pelicula.generosDetalle}
              </p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

const Tendencias = () => {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const pistaRef = useRef<HTMLDivElement>(null);
  const inicioToqueRef = useRef<number | null>(null);

  const [desplazamiento, actualizarDesplazamiento] = useReducer(
    (_anterior: number, nuevo: number) => nuevo,
    0,
  );

  const moverCarrusel = (direccion: "izquierda" | "derecha") => {
    const contenedor = contenedorRef.current;
    const pista = pistaRef.current;

    if (!contenedor || !pista) {
      return;
    }

    const anchoVisible = contenedor.clientWidth;
    const anchoTotal = pista.scrollWidth;

    const desplazamientoMaximo = Math.max(0, anchoTotal - anchoVisible);

    const paso = anchoVisible < 640 ? 306 : 612;

    const movimiento = direccion === "derecha" ? paso : -paso;

    const nuevaPosicion = Math.max(
      0,
      Math.min(desplazamiento + movimiento, desplazamientoMaximo),
    );

    actualizarDesplazamiento(nuevaPosicion);
  };

  const iniciarToque = (evento: React.TouchEvent<HTMLDivElement>) => {
    inicioToqueRef.current = evento.touches[0]?.clientX ?? null;
  };

  const terminarToque = (evento: React.TouchEvent<HTMLDivElement>) => {
    const inicio = inicioToqueRef.current;

    if (inicio === null) {
      return;
    }

    const final = evento.changedTouches[0]?.clientX ?? inicio;

    const diferencia = inicio - final;

    if (Math.abs(diferencia) > 50) {
      moverCarrusel(diferencia > 0 ? "derecha" : "izquierda");
    }

    inicioToqueRef.current = null;
  };

  return (
    <section
      id="tendencias"
      className="relative overflow-hidden bg-[#080b1d] px-5 py-14 sm:px-8 lg:px-12 xl:px-16"
    >
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-screenora-violet sm:text-xs">
            Lo más popular
          </p>

          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            En tendencia
          </h2>

          <p className="mt-2 text-sm text-white/45">
            Descubre las películas y series que están dando de qué hablar.
          </p>
        </div>

        <Link
          to="/catalogo"
          className="flex w-fit items-center gap-2 text-sm font-bold text-white/75 transition-colors duration-300 hover:text-screenora-violet"
        >
          Explorar catálogo
          <span className="text-xl">›</span>
        </Link>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => moverCarrusel("izquierda")}
          aria-label="Ver contenidos anteriores"
          className="absolute left-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-[#080b1d]/80 text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-screenora-purple sm:flex"
        >
          <ArrowLeftIcon />
        </button>

        <div
          ref={contenedorRef}
          onTouchStart={iniciarToque}
          onTouchEnd={terminarToque}
          aria-label="Carrusel de contenidos en tendencia"
          className="overflow-hidden pb-7 pt-4"
        >
          <div
            ref={pistaRef}
            className="flex w-max gap-4 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translate3d(-${desplazamiento}px, 0, 0)`,
            }}
          >
            {peliculas.map((pelicula) => (
              <TarjetaTendencia key={pelicula.titulo} pelicula={pelicula} />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => moverCarrusel("derecha")}
          aria-label="Ver más contenidos"
          className="absolute right-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-[#080b1d]/80 text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-screenora-purple sm:flex"
        >
          <ArrowRightIcon />
        </button>
      </div>
    </section>
  );
};

export default Tendencias;
