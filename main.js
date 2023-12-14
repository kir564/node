const auth = require('./middlewares/auth');
const express = require('express');
const cookieParser = require('cookie-parser');
const chalk = require('chalk');
const {
  addNote,
  getNotes,
  removeNote,
  editNote,
} = require('./notes.controller');
const mongoose = require('mongoose');
const path = require('path');
const { addUser, loginUser } = require('./user.controller');

const port = 3010;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'pages');

app.use(express.static(path.join(__dirname, './public')));
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get('/login', async (req, res) => {
  res.render('login', {
    title: 'Express App',
    error: undefined,
  });
});

app.post('/login', async (req, res) => {
  try {
    const token = await loginUser(req.body.email, req.body.password);
    res.cookie('token', token);

    res.redirect('/');
  } catch (error) {
    res.render('login', {
      title: 'Express App',
      error: error.message,
    });
  }
});

app.get('/register', async (req, res) => {
  res.render('register', {
    title: 'Express App',
    error: undefined,
  });
});

app.post('/register', async (req, res) => {
  try {
    await addUser(req.body.email, req.body.password);

    res.redirect('/login');
  } catch (error) {
    if (error.code === 11000) {
      res.render('register', {
        title: 'Express App',
        error: 'Email is already register',
      });

      return;
    }
    res.render('register', {
      title: 'Express App',
      error: error.message,
    });
  }
});

app.get('/logout', async (req, res) => {
  res.cookie('token', '');
  res.redirect('/login');
});

app.use(auth);

app.get('/', async (req, res) => {
  console.log(req.user);
  res.render('main', {
    title: 'Express App',
    notes: await getNotes(),
    userEmail: req.user.email,
    created: false,
    error: false,
  });
});

app.post('/', async (req, res) => {
  try {
    await addNote(req.body.title, req.user.email);
    res.render('main', {
      title: 'Express App',
      notes: await getNotes(),
      userEmail: req.user.email,
      created: true,
      error: false,
    });
  } catch (error) {
    console.log('Creation error: ', error);
    res.render('main', {
      title: 'Express App',
      notes: await getNotes(),
      userEmail: req.user.email,
      error: true,
      created: false,
    });
  }
});

app.delete('/:id', async (req, res) => {
  try {
    await removeNote(req.params.id);
    res.render('main', {
      title: 'Express App',
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: false,
    });
  } catch (error) {
    res.render('main', {
      title: 'Express App',
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: error.message,
    });
  }
});

app.put('/:id', async (req, res) => {
  try {
    await editNote({ id: req.params.id, title: req.body.title });
    res.render('main', {
      title: 'Express App',
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: false,
    });
  } catch (error) {
    res.render('main', {
      title: 'Express App',
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: error.message,
    });
  }
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
