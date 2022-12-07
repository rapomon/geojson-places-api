"use strict";

const { test } = require("tap");
const { build } = require("../helper");

test("state/:code", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/state/ES-VA"
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  t.hasProps(payload, [
    "state_code",
    "state_name"
  ]);
});

test("state/:code (locale query parameter)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/state/ES-VA",
    query: { locale: "es-ES" }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  t.has(payload.state_name, "Provincia de Valladolid");
});

test("state/:code (accept-language header)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/state/ES-VA",
    headers: { "accept-language": "en,es,es-ES;q=es,en;q=0.8,en-GB;q=0.7,en-US;q=0.6" }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  t.has(payload.state_name, "Valladolid Province");
});

test("state/:code (not found)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/state/XX-XX"
  });

  t.equal(res.statusCode, 404);
});

test("state/:code/geojson", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/state/ES-VA/geojson"
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
});

test("state/:code/geojson (not found)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/state/XX-XX/geojson"
  });

  t.equal(res.statusCode, 404);
});
