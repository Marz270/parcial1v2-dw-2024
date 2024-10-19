import { FastifyPluginAsync } from "fastify";
import { ComentarioFullSchema, ComentarioPostType, ComentarioSchema, ComentarioType, IdComentarioSchema } from "../../../../../../types/comentario.js";
import { Type } from "@sinclair/typebox";
import { IdTema } from "../../../../../../types/tema.js";
import { IdUsuarioSchema } from "../../../../../../types/usuario.js";
import * as comentarioService from "../../../../../../services/comentarios.js"
const comentarioRoutes: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.post("/", {
    schema: {
      body: ComentarioSchema,
      params: Type.Intersect([IdTema, IdUsuarioSchema]),
      response: {
        201: {
          description: "Comentario ingresado.",
          content: {
            "application/json": {
              schema: ComentarioFullSchema,
            },
          },
        },
      },
    },
    onRequest: [fastify.verifyJWT, fastify.verifySelfOrAdmin],
    handler: async function (request, reply) {
      const nuevoComentario = request.body as ComentarioPostType;
      const { id_usuario, id_tema } = request.params as {
        id_usuario: number;
        id_tema: number;
      };
      reply.code(201);
      const res = await comentarioService.create(id_tema, id_usuario, nuevoComentario.descripcion)
      return res;
    },
  });
  fastify.get("/", {
    schema: {
      params: IdTema,
      response: {
        200: {
          description: "Comentarios recibidos.",
        },
      },
    },
    onRequest: [fastify.verifyJWT, fastify.verifySelfOrAdmin],
    handler: async function (request, reply) {
      const { id_tema } = request.params as {
        id_tema: number;
      };
      const res = await comentarioService.findAll(id_tema);
      if (res.length === 0) {
        reply.code(404).send({ message: "No se encontraron comentarios" });
        return;
      }
      const comentarios = res;
      return comentarios;
    },
  });
  fastify.put("/:id_comentario", {
    schema: {
      params: Type.Intersect([IdComentarioSchema, IdTema]),
      body: ComentarioSchema,
      response: {
        200: {
          description: "Comentario editado de forma correcta.",
        },
      },
    },
    onRequest: [fastify.verifyJWT, fastify.verifySelfOrAdmin],
    handler: async function (request, reply) {
      const comentarioEditado = request.body as ComentarioType;
      const { id_comentario , id_tema } = request.params as { id_comentario: number, id_tema: number };
      const res = await comentarioService.modify(id_tema, id_comentario, comentarioEditado.descripcion)
      return res;
    },
  });
  fastify.delete("/:id_comentario", {
    schema: {
      params: Type.Intersect([IdComentarioSchema, IdTema]),
      response: {
        200: {
          description: "Comentario eliminado.",
        },
      },
    },
    onRequest: [fastify.verifyJWT, fastify.verifySelfOrAdmin],
    handler: async function (request, reply) {
      const { id_comentario, id_tema } = request.params as { id_comentario: number, id_tema: number };
      const res = await comentarioService.erase(id_tema, id_comentario)
      return res;
    },
  });
};
export default comentarioRoutes;
