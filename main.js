const express = require('express');
const chalk = require('chalk');
const {
  addNote,
  getNotes,
  removeNote,
  editNote,
} = require('./notes.controller');
const mongoose = require('mongoose');
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
    error: false,
  });
});

app.post('/', async (req, res) => {
  try {
    await addNote(req.body.title);
    res.render('main', {
      title: 'Express App',
      notes: await getNotes(),
      created: true,
      error: false,
    });
  } catch (error) {
    console.log('Creation error: ', error);
    res.render('main', {
      title: 'Express App',
      notes: await getNotes(),
      error: true,
      created: false,
    });
  }
});

app.delete('/:id', async (req, res) => {
  await removeNote(req.params.id);
  res.render('main', {
    title: 'Express App',
    notes: await getNotes(),
    created: false,
    error: false,
  });
});

app.put('/:id', async (req, res) => {
  await editNote({ id: req.params.id, title: req.body.title });

  res.render('main', {
    title: 'Express App',
    notes: await getNotes(),
    created: false,
    error: false,
  });
});

mongoose
  .connect(
    'mongodb+srv://k563ke70:YWieZnCkY3QvezYJ@cluster0.pxntl8x.mongodb.net/notes?retryWrites=true&w=majority'
  )
  .then(async () => {
    app.listen(port, () => {
      console.log(chalk.green(`Server has been started on port ${port}...`));
    });
  });
