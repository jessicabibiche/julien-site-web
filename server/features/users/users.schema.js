import { z } from "zod";

export const RegisterUserSchema = z.object({
  pseudo: z
    .string()
    .min(3, { message: "Le nom doit comporter au moins 3 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  password: z
    .string()
    .min(6, { message: "Le mot de passe doit comporter au moins 6 caractères" })
    .regex(/[A-Z]/, {
      message: "Le mot de passe doit comporter au moins une lettre majuscule",
    })
    .regex(/\d/, {
      message: "Le mot de passe doit comporter au moins un chiffre",
    })
    .regex(/[@$!%*?&#]/, {
      message:
        "Le mot de passe doit comporter au moins un caractère spécial (@, $, !, %, *, ?, &, #, .)",
    }),
});

export const LoginUserSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string(),
});
