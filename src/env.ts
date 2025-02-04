import {config} from "dotenv";
import {expand} from "dotenv-expand";
import {z, ZodError} from "zod";

const stringBoolean = z.coerce
  .string()
  .transform((val) => val === "true")
  .default("false");

let EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  DB_MIGRATING: stringBoolean,
  DB_SEEDING: stringBoolean,
});

export type EnvSchemaType = z.infer<typeof EnvSchema>;

// expand variables in .env so that they can be coerced
expand(config());

try {
  EnvSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    let message = "Missing required values in .env:\n";
    error.issues.forEach((issue) => {
      message += issue.path[0] + "\n";
    });
    const e = new Error(message);
    e.stack = "";
    throw e;
  } else {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

export default EnvSchema.parse(process.env);
