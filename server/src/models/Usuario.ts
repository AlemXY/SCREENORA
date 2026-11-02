import mongoose, { Schema, type InferSchemaType } from "mongoose";

const usuarioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    correo: {
      type: String,
      required: [true, "El correo es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Ingresa un correo válido"],
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type UsuarioDatos = InferSchemaType<typeof usuarioSchema>;

const Usuario = mongoose.model<UsuarioDatos>(
  "Usuario",
  usuarioSchema,
  "usuarios",
);

export default Usuario;
