import { useReducer, useRef } from "react";
import { createPortal } from "react-dom";

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
        className="w-72.5 shrink-0 cursor-pointer outline-offset-4 focus-visible:outline-2 focus-visible:outline-screenora-violet"
      >
        <div className="relative aspect-16/10 overflow-hidden rounded-xl bg-white/5">
          <img
            src={pelicula.imagen}
            alt={pelicula.titulo}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />

          <div className="absolute left-3 top-3 flex gap-1.5">
            {pelicula.etiquetas.map((etiqueta) => (
              <span
                key={etiqueta}
                className={`rounded px-2 py-1 text-[11px] font-extrabold text-white ${
                  etiqueta === "HDR"
                    ? "bg-black/80"
                    : etiqueta === "NEW"
                      ? "bg-green-500"
                      : etiqueta === "Sub"
                        ? "bg-screenora-violet"
                        : "bg-orange-500"
                }`}
              >
                {etiqueta}
              </span>
            ))}
          </div>
        </div>

        <div className="px-1 pt-4">
          <h3 className="text-[17px] font-extrabold text-white">
            {pelicula.titulo}
          </h3>

          <p className="mt-1 text-[15px] text-white/65">{pelicula.generos}</p>
        </div>
      </article>

      {estado.abierto &&
        createPortal(
          <div
            onMouseEnter={cancelarCierre}
            onMouseLeave={cerrarPanel}
            className={`fixed z-999 overflow-y-auto rounded-xl bg-[#191c35] shadow-2xl transition-all duration-300 ease-out ${
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

              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#191c35]/60 via-transparent to-transparent" />

              <button
                type="button"
                onClick={cambiarSonido}
                disabled={!estado.reproduciendo}
                aria-label={
                  estado.silenciado ? "Activar sonido" : "Silenciar tráiler"
                }
                className={`absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#292c47] text-white transition-all duration-300 ${
                  estado.reproduciendo
                    ? "cursor-pointer opacity-100 hover:bg-[#393c58]"
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

            <div className="px-6 pb-6 pt-5">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="text-xl font-extrabold text-white">
                  {pelicula.titulo}
                </h3>

                <button
                  type="button"
                  onClick={cerrarInmediatamente}
                  aria-label="Cerrar vista previa"
                  className="cursor-pointer rounded-lg px-2 py-1 text-xl text-white/70 hover:bg-white/10 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="mb-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  title="Próximamente: ver contenido completo"
                  className="flex cursor-pointer items-center gap-2 rounded-lg bg-linear-to-r from-screenora-purple to-screenora-violet px-5 py-3 text-sm font-bold text-white transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <PlayIcon />
                  Ver ahora
                </button>

                <button
                  type="button"
                  title="Próximamente: agregar a mi lista"
                  className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#30334f] px-5 py-3 text-sm font-bold text-white transition-colors duration-300 hover:bg-[#3a3d5c]"
                >
                  Mi lista
                  <BookmarkIcon />
                </button>

                <button
                  type="button"
                  title="Próximamente: información detallada"
                  className="cursor-pointer rounded-lg bg-[#30334f] px-5 py-3 text-sm font-bold text-white transition-colors duration-300 hover:bg-[#3a3d5c]"
                >
                  Detalle ⓘ
                </button>
              </div>

              <div className="mb-5 flex flex-wrap items-center gap-2.5 text-sm font-semibold text-white">
                <span className="rounded-md border border-yellow-400 px-2.5 py-1.5 text-yellow-400">
                  IMDB {pelicula.puntuacion}
                </span>

                <span className="rounded-md border border-white/20 px-2.5 py-1.5">
                  {pelicula.clasificacion}
                </span>

                <span className="rounded-md border border-white/20 px-2.5 py-1.5">
                  {pelicula.año}
                </span>

                <span className="rounded-md border border-white/20 px-2.5 py-1.5">
                  {pelicula.duracion}
                </span>
              </div>

              <p className="leading-6 text-white/70">
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

    // 290px de tarjeta + 16px de separación.
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
      className="bg-screenora-bg px-6 py-14 lg:px-10 xl:px-9"
    >
      <div className="mb-7 flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-white">En tendencia</h2>

        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 text-sm font-bold text-white transition-opacity duration-300 hover:opacity-70"
        >
          Ver todas
          <span className="text-xl">›</span>
        </button>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => moverCarrusel("izquierda")}
          aria-label="Ver contenidos anteriores"
          className="absolute left-2 top-26.25 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all duration-300 ease-in-out hover:scale-110 hover:bg-screenora-purple"
        >
          <ArrowLeftIcon />
        </button>

        <div
          ref={contenedorRef}
          onTouchStart={iniciarToque}
          onTouchEnd={terminarToque}
          className="overflow-hidden pb-6 pt-4"
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
          className="absolute right-2 top-26.25 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all duration-300 ease-in-out hover:scale-110 hover:bg-screenora-purple"
        >
          <ArrowRightIcon />
        </button>
      </div>
    </section>
  );
};

export default Tendencias;
