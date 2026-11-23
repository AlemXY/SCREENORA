import mongoose, { Schema, type InferSchemaType } from "mongoose";

const directorSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    obraRelacionada: {
      type: String,
      required: true,
      trim: true,
    },
    tipoProduccion: {
      type: String,
      required: true,
      enum: ["Cine", "Serie", "Animación"],
    },
    imagen: {
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

export type DirectorDatos = InferSchemaType<typeof directorSchema>;

const Director = mongoose.model<DirectorDatos>(
  "Director",
  directorSchema,
  "directores",
);

export default Director;
