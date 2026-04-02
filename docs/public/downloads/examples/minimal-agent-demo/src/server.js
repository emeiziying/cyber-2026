import http from "node:http";
import { pathToFileURL } from "node:url";

import { createNote, listNotes } from "./services/note-service.js";
import { fail, ok } from "./utils/response.js";

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "127.0.0.1";

function sendJson(res, payload) {
  res.writeHead(payload.statusCode, {
    "content-type": "application/json; charset=utf-8"
  });
  res.end(payload.body);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;
    });

    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        const error = new Error("Request body must be valid JSON");
        error.code = "BAD_JSON";
        error.statusCode = 400;
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

export const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

    if (req.method === "GET" && url.pathname === "/health") {
      sendJson(res, ok({ status: "ok" }));
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/notes") {
      const notes = listNotes({ search: url.searchParams.get("search") ?? "" });
      sendJson(res, ok(notes));
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/notes") {
      const body = await readJsonBody(req);
      const note = createNote(body);
      sendJson(res, ok(note, 201));
      return;
    }

    sendJson(
      res,
      fail(
        {
          code: "NOT_FOUND",
          message: "Route not found"
        },
        404
      )
    );
  } catch (error) {
    const statusCode = error.statusCode ?? 500;
    const message =
      statusCode >= 500 ? "Something went wrong" : error.message;

    sendJson(
      res,
      fail(
        {
          code: error.code ?? "INTERNAL_ERROR",
          message
        },
        statusCode
      )
    );
  }
});

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  server.listen(PORT, HOST, () => {
    process.stdout.write(
      `Minimal Agent Demo server listening on http://${HOST}:${PORT}\n`
    );
  });
}
