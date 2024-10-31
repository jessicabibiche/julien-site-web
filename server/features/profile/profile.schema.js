import { z } from "zod";

export const UpdateBioSchema = z.object({
  bio: z
    .string()
    .max(500, { message: "La bio doit comporter au maximum 500 caractères" }),
});
