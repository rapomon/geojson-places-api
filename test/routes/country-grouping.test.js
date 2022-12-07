"use strict";

const { test } = require("tap");
const { build } = require("../helper");

test("country-grouping", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/country-grouping"
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  for(const item of payload) {
    t.hasProps(item, [
      "grouping_code",
      "grouping_name",
      "countries"
    ]);
  }
});

test("country-grouping/:code", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/country-grouping/EMEA"
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  t.hasProps(payload, [
    "grouping_code",
    "grouping_name",
    "countries"
  ]);
});

test("country-grouping/:code (locale query parameter)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/country-grouping/EMEA",
    query: { locale: "es-ES" }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  t.has(payload.grouping_code, "EMEA");
  t.has(payload.grouping_name, "Europa, Medio Oriente y África");
  t.type(payload.countries, "object");
  for(const country of payload.countries) {
    t.type(country, "string");
  }
});

test("country-grouping/:code (accept-language header)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/country-grouping/EMEA",
    headers: { "accept-language": "en,es,es-ES;q=es,en;q=0.8,en-GB;q=0.7,en-US;q=0.6" }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  t.has(payload.grouping_code, "EMEA");
  t.has(payload.grouping_name, "Europe, the Middle East and Africa");
  t.type(payload.countries, "object");
  for(const country of payload.countries) {
    t.type(country, "string");
  }
});

test("country-grouping/:code (not found)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/country-grouping/XX"
  });

  t.equal(res.statusCode, 404);
});

test("country-grouping/:code/geojson", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/country-grouping/EMEA/geojson"
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
});

test("country-grouping/:code/geojson (not found)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/country-grouping/XX/geojson"
  });

  t.equal(res.statusCode, 404);
});

test("country-grouping/:code/countries", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/country-grouping/EMEA/countries"
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

test("country-grouping/:code/countries (not found)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/country-grouping/XX/countries"
  });

  t.equal(res.statusCode, 404);
});
