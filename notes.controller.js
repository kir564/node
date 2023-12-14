const Note = require('./models/Note');

const getNotes = async () => {
  const notes = await Note.find();

  return notes;
};

const addNote = async (title, owner) => {
  Note.create({ title, owner });
};

const removeNote = async (id, owner) => {
  const result = await Note.deleteOne({ _id: id, owner });

  if (result.matchedCount === 0) {
    throw new Error('No note for delete');
  }
};

const editNote = async ({ id, title, owner }) => {
  const result = await Note.updateOne({ _id: id, owner }, { title });

  if (result.matchedCount === 0) {
    throw new Error('No note for edit');
  }
};

module.exports = {
  addNote,
  getNotes,
  removeNote,
  editNote,
};
