import app from "./app";
import { AppDataSource } from "./data-source";

AppDataSource.initialize().then(() => {
  console.log("Database initialized");

  const PORT = process.env.PORT;
  const logMsg = `Server running on localhost:${PORT}`;

  app.listen(PORT, () => console.log(logMsg));
});
