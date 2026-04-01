const notes = [];
let nextId = 1;

export function insertNote({ title, content }) {
  const note = {
    id: nextId++,
    title,
    content,
    createdAt: new Date().toISOString()
  };

  notes.push(note);
  return note;
}

export function findNotes({ search = "" } = {}) {
  const keyword = search.trim().toLowerCase();

  if (!keyword) {
    return [...notes];
  }

  return notes.filter((note) => {
    return (
      note.title.toLowerCase().includes(keyword) ||
      note.content.toLowerCase().includes(keyword)
    );
  });
}

export function resetNotes() {
  notes.length = 0;
  nextId = 1;
}
