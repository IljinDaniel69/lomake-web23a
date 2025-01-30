import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Palaute-data REST-apia varten
import feedback from './feedback_mock.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const host = 'localhost';
const port = 3000;

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

app.use('/styles', express.static('includes/styles'));

app.use(express.urlencoded({ extended: true }));

// Polkumäärittelyt ejs-sivupohjia käyttäville web-sivuille
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/palautelomake', (req, res) => {
    res.render('palaute');
});
app.post('/palautelomake', async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let feedback = req.body.feedback;

    fs.readFile('data.json', 'utf8', function (err, dataString) {
        if (err) {
            console.log('ERR: Palaute-datan lukeminen epäonnistui');
        }
        else {
            let data = [];
            try {
                data = JSON.parse(dataString);
                if (!Array.isArray(data)) {
                    data = [];
                    throw new TypeError('Data not an array');
                }
            } catch (error) {
                console.log('ERR: Palaute-datan lukeminen epäonnistui');
                console.log(error);
            }

            data.push({
                name: name,
                email: email,
                feedback: feedback
            });
        
            fs.writeFile('data.json', JSON.stringify(data), { encoding: 'utf8' }, (err) => {
                if (err) {
                    console.log('ERR: Palaute-datan tallettaminen epäonnistui');
                }
                else {
                    console.log('OK:  Palaute-datan tallettaminen onnistui');
                }
            });
        
            res.render('vastaus', { name: name, email: email });
        }
    });
});

// REST-palvelimen polut
app.get('/palaute/', (req, res) => {
    // Palauttaa kaikki palautteet
    res.json(feedback);
});
app.get('/palaute/:id', (req, res) => {
    // Palauttaa yhden palautteen
});
app.post('/palaute/uusi', (req, res) => {
    // Lisää uuden palautteen. Palaute pyynnön body:ssä
});
app.put('/palaute/:id', (req, res) => {
    // Muokkaa tietyn palautteen sisältöä. (Miksi tällainen on?)
});
app.delete('/palaute/:id', (req, res) => {
    // Poistaa tietyn palautteen. (Miksi tällainen on?)
});

// Aina viimeisenä palvelimen käynnistys
app.listen(port, host, () => console.log(`${host}:${port} kuuntelee...`));