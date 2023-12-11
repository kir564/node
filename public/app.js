const remove = async (id) => {
  fetch(`/${id}`, {
    method: 'DELETE',
  });
};

const edit = async (title, id) =>
  fetch(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      title,
      id,
    }),
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
  });

document.addEventListener('click', (e) => {
  const { id, type, note } = e.target.dataset;

  if (type === 'remove') {
    remove(id).then(() => {
      e.target.closest('li').remove();
    });
  }

  if (type === 'edit') {
    const title = prompt('edit to note', note);

    if (title !== null) {
      edit(title, id).then(() => {
        e.target.closest('li').firstChild.textContent = title;
      });
    }
  }
});
