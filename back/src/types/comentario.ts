import { Static, Type } from "@sinclair/typebox";

export const IdComentarioSchema = Type.Object({
  id_comentario: Type.Integer({
    description: "El identificador unico de un comentario",
  }),
});

export type IdComentarioType = Static<typeof IdComentarioSchema>;

export const ComentarioSchema = Type.Object({
    descripcion: Type.String({ description: "Contenido del comentario" })
});

export type ComentarioPostType = Static<typeof ComentarioSchema>;

export const ComentarioFullSchema = Type.Intersect([
  IdComentarioSchema,
  ComentarioSchema,
  Type.Object({
    id_tema: Type.Integer({
        description:
          "El identificador del tema en la que se ingreso el comentario",
    }),
    id_usuario: Type.Integer({
        description: "Identificador del usuario que ingreso el comentario",
    }),
    fecha_ingresado: Type.String({
      format: "date",
      description: "Fecha en la que se ingreso el comentario",
    }),
  }),
]);

export type ComentarioType = Static<typeof ComentarioFullSchema>;
