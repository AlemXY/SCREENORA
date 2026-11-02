import mongoose, { Schema, type InferSchemaType } from "mongoose";

const administradorSchema = new Schema(
  {
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

export type AdministradorDatos = InferSchemaType<typeof administradorSchema>;

const Administrador = mongoose.model<AdministradorDatos>(
  "Administrador",
  administradorSchema,
  "administradores",
);

export default Administrador;
