import express from 'express';
import path from 'path';
import fs from 'fs';
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

// Polkumäärittelyt
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/palaute', (req, res) => {
    res.render('palaute');
});
app.post('/palaute', async (req, res) => {
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


app.listen(port, host, () => console.log(`${host}:${port} kuuntelee...`));