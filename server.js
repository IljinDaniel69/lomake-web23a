import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const host = 'localhost';
const port = 3000;

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

app.use('/styles', express.static('includes/styles'));

app.use(express.urlencoded({ extended: true }));

// TODO: Tähän tulevat polkumäärittelyt
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/palaute', (req, res) => {
    res.render('palaute');
});
app.post('/palaute', (req, res) => {
    let name = req.body.name;
    let email = req.body.email;

    res.render('vastaus', { name: name, email: email });
});


app.listen(port, host, () => console.log(`${host}:${port} kuuntelee...`));