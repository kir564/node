const express = require('express');
const chalk = require('chalk');
const {
  addNote,
  getNotes,
  removeNote,
  editNote,
} = require('./notes.controller');
const path = require('path');

const port = 3010;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'pages');

app.use(express.static(path.join(__dirname, './public')));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get('/', async (req, res) => {
  res.render('main', {
    title: 'Express App',
    notes: await getNotes(),
    created: false,
  });
});

app.post('/', async (req, res) => {
  await addNote(req.body.title);
  res.render('main', {
    title: 'Express App',
    notes: await getNotes(),
    created: true,
  });
});

app.delete('/:id', async (req, res) => {
  await removeNote(req.params.id);
  res.render('main', {
    title: 'Express App',
    notes: await getNotes(),
    created: false,
  });
});

app.put('/:id', async (req, res) => {
  await editNote(req.body);

  res.render('main', {
    title: 'Express App',
    notes: await getNotes(),
    created: false,
  });
});

app.listen(port, () => {
  console.log(chalk.green(`Server has been started on port ${port}...`));
});
