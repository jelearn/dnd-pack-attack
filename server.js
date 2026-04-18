import express from 'express';
import favicon from 'express-favicon';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 8080;
const app = express();

app.use(favicon(join(__dirname, 'dist', 'favicon.ico')));
app.use(express.static(join(__dirname, 'dist')));
app.get('/ping', (req, res) => res.send('pong'));
app.get('/index.html', (req, res) => res.sendFile(join(__dirname, 'dist', 'index.html')));
app.get('/', (req, res) => res.redirect('/index.html'));
app.listen(port);
