import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import { env } from "process";
import bcrypt from "bcrypt";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
//import path from "path";
//import { BsCartX } from "react-icons/bs";
import recoverPasswordTemplate from "~/utils/recoverpwdtemplate";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: env.NODEMAILER_USER,
    pass: env.NODEMAILER_PWD,
  },
});

export const resetPwdRouter = createTRPCRouter({
  sendResetPwdEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { email } = input;

      const user = await ctx.prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new Error("Este email no esta registrado");
      }
      const name = user.name as string;
      const token = uuidv4();
      await ctx.prisma.passwordResetToken.create({
        data: {
          token,
          email,
          expiresAt: new Date(Date.now() + 3600000),
        },
      });
      const redirectURL =
        env.NODE_ENV === "production"
          ? `https://mindfuel.vercel.app/reestablecer-contrasena/${token}`
          : `http://localhost:3000/reestablecer-contrasena/${token}`;

      const mailOptions = {
        from: env.NODEMAILER_USER,
        to: email,
        subject: "Recupere su contraseña de MindFuel",
        html: recoverPasswordTemplate(name, redirectURL),
      };

      try {
        await transporter.sendMail(mailOptions);
        return { success: true };
      } catch (err) {
        return { success: false };
      }
    }),

  getEmailByToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input, ctx }) => {
      const { token } = input;

      const passwordResetToken = await ctx.prisma.passwordResetToken.findUnique(
        {
          where: {
            token,
          },
          select: {
            email: true,
          },
        }
      );

      if (!passwordResetToken) {
        return null;
      }

      return passwordResetToken.email;
    }),

  resetPwd: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      const user = await ctx.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error("User Not Found");
      }
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      await ctx.prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });
      return user;
    }),

  deletePwdResetToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { token } = input;

      const resetToken = await ctx.prisma.passwordResetToken.findUnique({
        where: { token },
      });

      if (!resetToken) {
        throw new Error("Token not found");
      } else {
        await ctx.prisma.passwordResetToken.delete({ where: { token } });
      }
      return true;
    }),

  checkValidToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input, ctx }) => {
      const { token } = input;
      const pwdResetToken = await ctx.prisma.passwordResetToken.findUnique({
        where: { token },
      });

      if (!pwdResetToken) {
        return false;
      }

      if (pwdResetToken.expiresAt < new Date()) {
        await ctx.prisma.passwordResetToken.delete({ where: { token } });
        return false;
      }

      return true;
    }),
});
