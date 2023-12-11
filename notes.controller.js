const fs = require('fs/promises');
const path = require('path');

const notesPath = path.join(__dirname, 'db.json');

const getNotes = async () => {
  const notes = await fs.readFile(notesPath, { encoding: 'utf-8' });

  return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
};

const addNote = async (title) => {
  const notes = await getNotes();

  const note = {
    title: title,
    id: Date.now().toString(),
  };

  notes.push(note);

  await fs.writeFile(notesPath, JSON.stringify(notes));
};

const removeNote = async (noteId) => {
  const notes = await getNotes();
  const notesFilter = notes.filter(({ id }) => id !== noteId);
  await fs.writeFile(notesPath, JSON.stringify(notesFilter));
};

const editNote = async ({ id, title }) => {
  const notes = await getNotes();
  const notesMap = notes.map((note) =>
    note.id === id ? { title: title, id } : note
  );
  await fs.writeFile(notesPath, JSON.stringify(notesMap));
};

module.exports = {
  addNote,
  getNotes,
  removeNote,
  editNote,
};
