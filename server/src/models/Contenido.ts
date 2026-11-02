import mongoose, { Schema, type InferSchemaType } from "mongoose";

const contenidoSchema = new Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    tipo: {
      type: String,
      required: [true, "El tipo es obligatorio"],
      enum: ["Película", "Serie"],
    },

    genero: {
      type: String,
      required: [true, "El género es obligatorio"],
      trim: true,
    },

    año: {
      type: Number,
      required: [true, "El año es obligatorio"],
      min: 1888,
      max: 2100,
      validate: {
        validator: Number.isInteger,
        message: "El año debe ser un número entero",
      },
    },

    duracion_minutos: {
      type: Number,
      required: [true, "La duración es obligatoria"],
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "La duración debe ser un número entero",
      },
    },

    clasificacion: {
      type: String,
      required: [true, "La clasificación es obligatoria"],
      trim: true,
    },

    puntuacion: {
      type: Number,
      required: [true, "La puntuación es obligatoria"],
      min: 0,
      max: 10,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
  },
);

export type ContenidoDatos = InferSchemaType<typeof contenidoSchema>;

const Contenido = mongoose.model<ContenidoDatos>(
  "Contenido",
  contenidoSchema,
  "contenidos",
);

export default Contenido;
