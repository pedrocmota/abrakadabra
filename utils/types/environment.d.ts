declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string,
      JWT_KEY: string,
      JWT_TIMEOUT: string
    }
  }
}

export interface IpublicRuntimeConfig {
  version: string
}

export { }