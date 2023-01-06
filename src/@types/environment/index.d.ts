type TNodeEnv = "test" | "production";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PGHOST: string;
      PGPORT: string;
      PGPASSWORD: string;
      PGDATABASE: string;
      PGUSER: string;
      PORT: string;
      NODE_ENV: TNodeEnv;
      SECRET_KEY: string;
    }
  }
}

export {};
