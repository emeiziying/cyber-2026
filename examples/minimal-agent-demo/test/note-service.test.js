import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { resetNotes } from "../src/repositories/note-repository.js";
import { createNote, listNotes } from "../src/services/note-service.js";

beforeEach(() => {
  resetNotes();
});

test("should create a note when input is valid", () => {
  const note = createNote({
    title: "Chapter 4",
    content: "Turn conventions into a CLAUDE.md file"
  });

  assert.equal(note.id, 1);
  assert.equal(note.title, "Chapter 4");
  assert.equal(note.content, "Turn conventions into a CLAUDE.md file");
  assert.match(note.createdAt, /^\d{4}-\d{2}-\d{2}T/);
});

test("should throw a validation error when title is empty", () => {
  assert.throws(
    () =>
      createNote({
        title: "   ",
        content: "Missing title should fail"
      }),
    (error) => {
      assert.equal(error.code, "VALIDATION_ERROR");
      assert.equal(error.statusCode, 400);
      assert.equal(error.message, "title is required");
      return true;
    }
  );
});

test("should filter notes when a search keyword is provided", () => {
  createNote({
    title: "Rules chapter",
    content: "Write project-level conventions"
  });
  createNote({
    title: "MCP chapter",
    content: "Connect GitHub and filesystem tools"
  });

  const results = listNotes({ search: "github" });

  assert.equal(results.length, 1);
  assert.equal(results[0].title, "MCP chapter");
});
