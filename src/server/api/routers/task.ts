import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {z} from "zod";
import { now } from "next-auth/client/_utils";

export const taskRouter = createTRPCRouter({
    createTask: protectedProcedure
        .input(z.object({ name: z.string(), description: z.string(), category: z.string(), routine_id: z.string(),
        event_id: z.string(), estimated_time:z.number(), required_energy: z.number() }))
        .mutation(async ({ input, ctx }) => {
            const { name, description, category, routine_id, event_id, estimated_time, required_energy } = input;
            const task = await ctx.prisma.task.create({
                data: {
                    name,
                    description,
                    category,
                    createdAt: new Date(now()),    
                    routine_id,
                    event_id,
                    estimated_time,
                    done: false,
                    real_time: null,
                    user_id: ctx.session.user.id,
                    required_energy,
                },
            });
            return { task };
        }
        ),
    getTasks: protectedProcedure
        .input(z.object({}))
        .query(async ({ ctx }) => {
            const tasks = await ctx.prisma.task.findMany({
                where: {
                    user_id: ctx.session.user.id,
                },
            });
            return { tasks };
        }
        ),
    getTasksbyRoutine: protectedProcedure
        .input(z.object({routine_id: z.string()}))
        .query(async ({ctx, input})=>{
            const tasks= await ctx.prisma.task.findMany({
                where:{
                    routine_id  : input.routine_id
                },
            })
            return {tasks}
        })
    })
