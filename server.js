import { name } from "ejs";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
const host = "localhost";

// Middleware JSON:n ja lomakedatan käsittelyyn
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Asetetaan EJS näkymämoottoriksi
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));

// Staattiset tiedostot
app.use("/styles", express.static(path.join(__dirname, "includes/styles")));

// Ladataan palautedata JSON-tiedostosta
const feedbackFile = path.join(__dirname, "feedback_mock.json");
let feedback = JSON.parse(fs.readFileSync(feedbackFile, "utf8"));

// **GET /** - Näyttää palautelomakkeen
app.get("/", (req, res) => {
  res.json("index");
});

// **GET /palaute** - Näyttää kaikki palautteet sivulla
app.get("/palaute", (req, res) => {
  res.json(feedback);
});

// **GET /palaute/:id** - Näyttää yksittäisen palautteen
app.get("/palaute/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const palaute = feedback.find((f) => f.id === id);

  if (!palaute) {
    return res.status(404).json({ error: "Palautetta ei löytynyt" });
  }

  res.json(palaute);
});

// **POST /palaute/uusi** - Lisää uuden palautteen
app.post("/palaute/uusi", (req, res) => {
  const { nimi, email, viesti } = req.body;

  if (!nimi || !email || !viesti) {
    return res.status(400).json({ error: "Kaikki kentät ovat pakollisia" });
  }

  const uusiPalaute = {
    id: feedback.length > 0 ? feedback[feedback.length - 1].id + 1 : 1,
    name: nimi,
    email: email,
    feedback: viesti,
  };

  feedback.push(uusiPalaute);
  res.json(uusiPalaute);
});

// **PUT /palaute/:id** - Muokkaa palautetta
app.put("/palaute/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { nimi, email, viesti } = req.body;
  const index = feedback.findIndex((f) => f.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Palautetta ei löytynyt" });
  }

  // Päivitetään tiedot
  feedback[index] = {
    id,
    name: nimi || feedback[index].name,
    email: email || feedback[index].email,
    feedback: viesti || feedback[index].feedback,
  };

  res.json(feedback[index]);
});

// **DELETE /palaute/:id** - Poistaa palautteen
app.delete("/palaute/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = feedback.findIndex((f) => f.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Palautetta ei löytynyt" });
  }

  feedback.splice(index, 1);
  res.json({ message: "Palaute poistettu" });
});

// Käynnistetään palvelin
app.listen(port, host, () => {
  console.log(`Palvelin käynnissä osoitteessa: http://localhost:${port}`);
});
