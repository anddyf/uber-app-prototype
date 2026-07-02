<<<<<<< HEAD
=======
import "dotenv/config";
>>>>>>> master
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
<<<<<<< HEAD
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
=======
  datasource: {
    url: env("DATABASE_URL"),
  },
});
>>>>>>> master
