"use strict";

const { test } = require("tap");
const { build } = require("../helper");

test("continent", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/continent"
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  for(let i = 0; i < payload.length; i++) {
    t.hasProps(payload[i], [
      "continent_code",
      "continent_name"
    ]);
  }
});

test("continent/:code", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/continent/EU"
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  t.hasProps(payload, [
    "continent_code",
    "continent_name",
    "countries"
  ]);
});

test("continent/:code (locale query parameter)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/continent/EU",
    query: { locale: "es-ES" }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  t.has(payload.continent_name, "Europa");
});

test("continent/:code (accept-language header)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/continent/EU",
    headers: { "accept-language": "vi,es,es-ES;q=es,en;q=0.8,en-GB;q=0.7,en-US;q=0.6" }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  t.has(payload.continent_name, "Châu Âu");
});

test("continent/:code (not found)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/continent/XX"
  });

  t.equal(res.statusCode, 404);
});

test("continent/:code/geojson", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/continent/EU/geojson"
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
});

test("continent/:code/geojson (not found)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/continent/XX/geojson"
  });

  t.equal(res.statusCode, 404);
});

test("continent/:code/countries", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/continent/EU/countries"
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  for(const item of payload) {
    t.hasProps(item, [
      "country_a2",
      "country_a3",
      "country_name"
    ]);
  }
});

test("continent/:code/countries (not found)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/continent/XX/countries"
  });

  t.equal(res.statusCode, 404);
});
