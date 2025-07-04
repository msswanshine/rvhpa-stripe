import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test'] as const),
  SESSION_SECRET: z.string().optional(),
  ENCRYPTION_SECRET: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  DEV_HOST_URL: z.string().optional(),
  PROD_HOST_URL: z.string().optional(),
  RESEND_API_KEY: z.string(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_ENDPOINT: z.string().optional(),
  HONEYPOT_ENCRYPTION_SEED: z.string().optional(),
  ARCJET_KEY: z.string(),
})

type EnvSchema = z.infer<typeof schema>

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends EnvSchema {}
  }
}

export function initEnvs() {
  const parsed = schema.safeParse(process.env)

  if (parsed.success === false) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors)
    throw new Error('Invalid environment variables.')
  }
}

/**
 * Exports shared environment variables.
 * Do *NOT* add any environment variables that do not wish to be included in the client.
 */
export function getSharedEnvs() {
  return {
    DEV_HOST_URL: process.env.DEV_HOST_URL,
    PROD_HOST_URL: process.env.PROD_HOST_URL,
  }
}
