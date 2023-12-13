const Note = require('./models/Note');

const getNotes = async () => {
  const notes = await Note.find();

  return notes;
};

const addNote = async (title) => {
  Note.create({ title });
};

const removeNote = async (noteId) => {
  await Note.deleteOne({ _id: noteId });
};

const editNote = async ({ id, title }) => {
  await Note.updateOne({ _id: id }, { title });
};

module.exports = {
  addNote,
  getNotes,
  removeNote,
  editNote,
};
