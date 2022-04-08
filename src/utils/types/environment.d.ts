declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string,
      JWT_KEY: string,
      JWT_TIMEOUT: string,
      MAILER_HOST: string,
      MAILER_PORT: string,
      MAILER_USER: string,
      MAILER_PASSWORD: string,
    }
  }
}

export interface IpublicRuntimeConfig {
  version: string
}

export { }