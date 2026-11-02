import { useReducer, type FormEvent, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";

import {
  registrarUsuario,
  iniciarSesionUsuario,
  verificarSesionUsuario,
  type Usuario,
} from "../services/usuariosApi";

import MiLista from "./MiLista";

type Modo = "login" | "registro";

type Campo = "nombre" | "correo" | "password" | "confirmarPassword";

type EstadoCuenta = {
  abierto: boolean;
  modo: Modo;
  nombre: string;
  correo: string;
  password: string;
  confirmarPassword: string;
  usuario: Usuario | null;
  token: string | null;
  error: string;
  mensaje: string;
};

type AccionCuenta =
  | { type: "ABRIR" }
  | { type: "CERRAR" }
  | { type: "CAMBIAR_MODO"; modo: Modo }
  | { type: "CAMBIAR_CAMPO"; campo: Campo; valor: string }
  | { type: "ERROR"; mensaje: string }
  | { type: "REGISTRADO"; correo: string }
  | { type: "CONECTADO"; usuario: Usuario; token: string }
  | { type: "SALIR" };

const estadoInicial: EstadoCuenta = {
  abierto: false,
  modo: "login",
  nombre: "",
  correo: "",
  password: "",
  confirmarPassword: "",
  usuario: null,
  token: null,
  error: "",
  mensaje: "",
};

const reducerCuenta = (
  estado: EstadoCuenta,
  accion: AccionCuenta,
): EstadoCuenta => {
  switch (accion.type) {
    case "ABRIR":
      return { ...estado, abierto: true };

    case "CERRAR":
      return {
        ...estado,
        abierto: false,
        password: "",
        confirmarPassword: "",
        error: "",
      };

    case "CAMBIAR_MODO":
      return {
        ...estado,
        modo: accion.modo,
        password: "",
        confirmarPassword: "",
        error: "",
        mensaje: "",
      };

    case "CAMBIAR_CAMPO":
      return {
        ...estado,
        [accion.campo]: accion.valor,
        error: "",
      };

    case "ERROR":
      return {
        ...estado,
        error: accion.mensaje,
        mensaje: "",
      };

    case "REGISTRADO":
      return {
        ...estado,
        modo: "login",
        correo: accion.correo,
        password: "",
        confirmarPassword: "",
        error: "",
        mensaje: "Cuenta creada correctamente. Ahora inicia sesión.",
      };

    case "CONECTADO":
      return {
        ...estadoInicial,
        abierto: true,
        usuario: accion.usuario,
        token: accion.token,
      };

    case "SALIR":
      return {
        ...estadoInicial,
        abierto: true,
        mensaje: "Has cerrado sesión correctamente.",
      };

    default:
      return estado;
  }
};

type Propiedades = {
  icon: ReactNode;
};

const CuentaUsuario = ({ icon }: Propiedades) => {
  const [cuenta, dispatch] = useReducer(reducerCuenta, estadoInicial);

  const mutacionRegistro = useMutation({
    mutationFn: registrarUsuario,
  });

  const mutacionLogin = useMutation({
    mutationFn: iniciarSesionUsuario,
  });

  const ocupado = mutacionRegistro.isPending || mutacionLogin.isPending;

  const cambiarCampo = (campo: Campo, valor: string) => {
    dispatch({ type: "CAMBIAR_CAMPO", campo, valor });
  };

  const cerrarVentana = () => {
    if (ocupado) return;
    dispatch({ type: "CERRAR" });
  };

  const enviarFormulario = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    if (ocupado) return;

    const correo = cuenta.correo.trim().toLowerCase();
    const password = cuenta.password;

    if (!correo || !password) {
      dispatch({
        type: "ERROR",
        mensaje: "Completa los campos obligatorios.",
      });
      return;
    }

    try {
      if (cuenta.modo === "registro") {
        const nombre = cuenta.nombre.trim();

        if (nombre.length < 2) {
          dispatch({
            type: "ERROR",
            mensaje: "El nombre debe tener al menos 2 caracteres.",
          });
          return;
        }

        if (password.length < 8) {
          dispatch({
            type: "ERROR",
            mensaje: "La contraseña debe tener al menos 8 caracteres.",
          });
          return;
        }

        if (password !== cuenta.confirmarPassword) {
          dispatch({
            type: "ERROR",
            mensaje: "Las contraseñas no coinciden.",
          });
          return;
        }

        await mutacionRegistro.mutateAsync({
          nombre,
          correo,
          password,
        });

        dispatch({ type: "REGISTRADO", correo });
        return;
      }

      const respuesta = await mutacionLogin.mutateAsync({
        correo,
        password,
      });

      const sesion = await verificarSesionUsuario(respuesta.token);

      if (!sesion.autenticado || sesion.rol !== "usuario") {
        throw new Error("No se pudo verificar la sesión.");
      }

      dispatch({
        type: "CONECTADO",
        usuario: sesion.usuario,
        token: respuesta.token,
      });
    } catch (error) {
      dispatch({
        type: "ERROR",
        mensaje:
          error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado.",
      });
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => dispatch({ type: "ABRIR" })}
        aria-label="Abrir cuenta de usuario"
        title={cuenta.usuario ? "Mi cuenta" : "Iniciar sesión o registrarse"}
        className="relative cursor-pointer text-white transition-opacity duration-300 hover:opacity-70"
      >
        {icon}

        {cuenta.usuario && (
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#11152e] bg-green-400" />
        )}
      </button>

      {cuenta.abierto && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4 py-6">
          <button
            type="button"
            aria-label="Cerrar ventana de cuenta"
            onClick={cerrarVentana}
            className="absolute inset-0 cursor-pointer bg-black/80 backdrop-blur-sm"
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="screenora-cuenta-titulo"
            onKeyDown={(evento) => {
              if (evento.key === "Escape") cerrarVentana();
            }}
            className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/15 bg-[#11152e] p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-screenora-violet">
                  SCREENORA
                </p>

                <h2
                  id="screenora-cuenta-titulo"
                  className="text-2xl font-extrabold text-white"
                >
                  {cuenta.usuario
                    ? "Mi cuenta"
                    : cuenta.modo === "registro"
                      ? "Crear cuenta"
                      : "Bienvenido de nuevo"}
                </h2>

                <p className="mt-2 text-sm text-white/55">
                  {cuenta.usuario
                    ? "Tu sesión está activa."
                    : "Accede a tu cuenta de SCREENORA."}
                </p>
              </div>

              <button
                type="button"
                onClick={cerrarVentana}
                disabled={ocupado}
                aria-label="Cerrar"
                className="cursor-pointer rounded-lg px-3 py-1 text-2xl text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                ×
              </button>
            </div>

            {cuenta.usuario ? (
              <div className="space-y-5">
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-white/50">Sesión iniciada como</p>

                  <p className="mt-2 text-xl font-bold text-white">
                    {cuenta.usuario.nombre}
                  </p>

                  <p className="mt-1 text-sm text-white/60">
                    {cuenta.usuario.correo}
                  </p>

                  <p className="mt-3 text-xs font-semibold text-green-300">
                    Cuenta verificada
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => dispatch({ type: "SALIR" })}
                  className="w-full cursor-pointer rounded-xl border border-red-400/30 px-5 py-3 font-bold text-red-300 transition-colors hover:bg-red-400/10"
                >
                  Cerrar sesión
                </button>

                {cuenta.token && cuenta.usuario && (
                  <MiLista token={cuenta.token} usuarioId={cuenta.usuario.id} />
                )}
              </div>
            ) : (
              <>
                <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-white/5 p-1">
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({ type: "CAMBIAR_MODO", modo: "login" })
                    }
                    disabled={ocupado}
                    className={`cursor-pointer rounded-lg py-3 text-sm font-bold transition-colors ${
                      cuenta.modo === "login"
                        ? "bg-screenora-purple text-white"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    Iniciar sesión
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      dispatch({ type: "CAMBIAR_MODO", modo: "registro" })
                    }
                    disabled={ocupado}
                    className={`cursor-pointer rounded-lg py-3 text-sm font-bold transition-colors ${
                      cuenta.modo === "registro"
                        ? "bg-screenora-purple text-white"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    Registrarse
                  </button>
                </div>

                <form onSubmit={enviarFormulario} className="space-y-4">
                  {cuenta.modo === "registro" && (
                    <div className="space-y-2">
                      <label
                        htmlFor="usuario-nombre"
                        className="text-sm font-semibold text-white/80"
                      >
                        Nombre
                      </label>

                      <input
                        id="usuario-nombre"
                        type="text"
                        required
                        minLength={2}
                        maxLength={80}
                        autoComplete="name"
                        value={cuenta.nombre}
                        onChange={(evento) =>
                          cambiarCampo("nombre", evento.target.value)
                        }
                        disabled={ocupado}
                        placeholder="Tu nombre"
                        className="h-12 w-full rounded-xl border border-white/15 bg-[#1d2142] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-screenora-violet"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label
                      htmlFor="usuario-correo"
                      className="text-sm font-semibold text-white/80"
                    >
                      Correo electrónico
                    </label>

                    <input
                      id="usuario-correo"
                      type="email"
                      required
                      maxLength={254}
                      autoComplete="email"
                      value={cuenta.correo}
                      onChange={(evento) =>
                        cambiarCampo("correo", evento.target.value)
                      }
                      disabled={ocupado}
                      placeholder="correo@ejemplo.com"
                      className="h-12 w-full rounded-xl border border-white/15 bg-[#1d2142] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-screenora-violet"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="usuario-password"
                      className="text-sm font-semibold text-white/80"
                    >
                      Contraseña
                    </label>

                    <input
                      id="usuario-password"
                      type="password"
                      required
                      minLength={cuenta.modo === "registro" ? 8 : undefined}
                      autoComplete={
                        cuenta.modo === "registro"
                          ? "new-password"
                          : "current-password"
                      }
                      value={cuenta.password}
                      onChange={(evento) =>
                        cambiarCampo("password", evento.target.value)
                      }
                      disabled={ocupado}
                      placeholder="Tu contraseña"
                      className="h-12 w-full rounded-xl border border-white/15 bg-[#1d2142] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-screenora-violet"
                    />
                  </div>

                  {cuenta.modo === "registro" && (
                    <div className="space-y-2">
                      <label
                        htmlFor="usuario-confirmar"
                        className="text-sm font-semibold text-white/80"
                      >
                        Confirmar contraseña
                      </label>

                      <input
                        id="usuario-confirmar"
                        type="password"
                        required
                        minLength={8}
                        autoComplete="new-password"
                        value={cuenta.confirmarPassword}
                        onChange={(evento) =>
                          cambiarCampo("confirmarPassword", evento.target.value)
                        }
                        disabled={ocupado}
                        placeholder="Repite tu contraseña"
                        className="h-12 w-full rounded-xl border border-white/15 bg-[#1d2142] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-screenora-violet"
                      />
                    </div>
                  )}

                  {cuenta.error && (
                    <p
                      role="alert"
                      className="rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300"
                    >
                      {cuenta.error}
                    </p>
                  )}

                  {cuenta.mensaje && (
                    <p
                      role="status"
                      className="rounded-lg border border-green-400/20 bg-green-400/10 p-3 text-sm text-green-300"
                    >
                      {cuenta.mensaje}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={ocupado}
                    className="w-full cursor-pointer rounded-xl bg-linear-to-r from-screenora-purple to-screenora-violet px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {ocupado
                      ? "Procesando..."
                      : cuenta.modo === "registro"
                        ? "Crear cuenta"
                        : "Iniciar sesión"}
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
};

export default CuentaUsuario;
