import * as solr from "solr-client";
import express, { Response } from "express";
import helmet from "helmet";
import compression from "compression";

const {
  PORT = 8000,
} = process.env;

const db = solr.createClient({
  core: "source_pages",
});

const app = express();

const sendErrorResponse = (response: Response, reason: any): void => {
  let original: Record<string, any>;

  try {
    const json = reason.message.replace(/^Request HTTP error \d+: */i, "");
    original = JSON.parse(json);
    response.status(original?.responseHeader?.status || 400);
  } catch(e) {
    original = reason?.message || reason;
    response.status(400);
  }

  response.send({
    errors: ["Something is horribly wrong with your query."],
    original,
  });
};

// TODO: this is ridiculous
app.use(express.json({ limit: "50mb" }));
app.use(helmet());
app.use(compression());

app.post('/source_pages', (request, response) => {
  db.add(request.body).then(() => db.commit()).then((addResponse) => {
    response.status(201);
    response.send(addResponse);
  }).catch((reason) => {
    sendErrorResponse(response, reason);
  });
});

app.get('/source_pages', (request, response) => {
  const q = `text_t:${request.query.q}`;
  const query = db.query()
    .q(q)
    .qop("or");

  db.search(query).then((searchResponse) => {
    response.status(200);
    response.send(searchResponse);
  }).catch((reason) => {
    sendErrorResponse(response, reason);
  });
});

app.listen(PORT, () => {
  console.log(`Serving at http://localhost:${PORT}`);
});
