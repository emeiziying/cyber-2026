import { findNotes, insertNote } from "../repositories/note-repository.js";

function createValidationError(message) {
  const error = new Error(message);

  error.code = "VALIDATION_ERROR";
  error.statusCode = 400;

  return error;
}

function requireText(value, fieldName) {
  if (typeof value !== "string" || value.trim() === "") {
    throw createValidationError(`${fieldName} is required`);
  }

  return value.trim();
}

export function createNote(input) {
  const title = requireText(input?.title, "title");
  const content = requireText(input?.content, "content");

  return insertNote({ title, content });
}

export function listNotes(query = {}) {
  const search = typeof query.search === "string" ? query.search.trim() : "";

  return findNotes({ search });
}
