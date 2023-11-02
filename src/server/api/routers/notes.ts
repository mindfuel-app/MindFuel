import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const notesRouter = createTRPCRouter({
  getNotes: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const notes = await ctx.prisma.note.findMany({
        where: {
          user_id: input.userId,
        },
      });

      return notes;
    }),

  createNote: protectedProcedure
    .input(z.object({ userId: z.string(), note: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.prisma.note.create({
        data: {
          user_id: input.userId,
          note: input.note,
        },
      });

      return note;
    }),

  deleteNote: protectedProcedure
    .input(z.object({ noteId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.prisma.note.delete({
        where: {
          id: input.noteId,
        },
      });

      return note;
    }),
});
