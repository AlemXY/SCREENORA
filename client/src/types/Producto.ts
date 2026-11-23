export interface Producto {
  _id: string;
  titulo: string;
  tipo: "Película" | "Serie";
  año: number;
  descripcion: string;
  imagen: string;
  categoria: {
    _id: string;
    nombre: string;
  };
}

export interface RespuestaProductos {
  success: boolean;
  data: Producto[];
}
