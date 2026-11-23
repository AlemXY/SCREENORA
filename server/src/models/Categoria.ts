import mongoose, { Schema, type InferSchemaType } from "mongoose";

const categoriaSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
      unique: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    foto: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type CategoriaDatos = InferSchemaType<typeof categoriaSchema>;

const Categoria = mongoose.model<CategoriaDatos>(
  "Categoria",
  categoriaSchema,
  "categorias",
);

export default Categoria;
