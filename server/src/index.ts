import app from "./app.js";

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  // Log simple para saber en qué puerto corre.
  console.log(`API lista en http://localhost:${PORT}`);
});
