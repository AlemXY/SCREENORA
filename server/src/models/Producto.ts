import mongoose, { Schema, type InferSchemaType } from "mongoose";

const productoSchema = new Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },
    tipo: {
      type: String,
      required: true,
      enum: ["Película", "Serie"],
    },
    año: {
      type: Number,
      required: true,
      min: 1888,
      max: 2100,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    imagen: {
      type: String,
      required: true,
      trim: true,
    },
    categoria: {
      type: Schema.Types.ObjectId,
      ref: "Categoria",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type ProductoDatos = InferSchemaType<typeof productoSchema>;

const Producto = mongoose.model<ProductoDatos>(
  "Producto",
  productoSchema,
  "productos",
);

export default Producto;
