import mongoose, { Schema, type InferSchemaType } from "mongoose";

const itemListaSchema = new Schema(
  {
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },

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

    estado: {
      type: String,
      enum: ["Pendiente", "Visto"],
      default: "Pendiente",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Facilita las consultas de la lista de cada usuario
itemListaSchema.index({
  usuario: 1,
  createdAt: -1,
});

export type ItemListaDatos = InferSchemaType<typeof itemListaSchema>;

const ItemLista = mongoose.model<ItemListaDatos>(
  "ItemLista",
  itemListaSchema,
  "listas_personales",
);

export default ItemLista;
