"use strict";

const { test } = require("tap");
const { build } = require("../helper");

test("country", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/country"
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

test("country/:code (alpha2)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/country/ES"
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  t.hasProps(payload, [
    "country_a2",
    "country_a3",
    "country_name"
  ]);
});

test("country/:code (alpha3)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/country/ESP"
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  t.hasProps(payload, [
    "country_a2",
    "country_a3",
    "country_name"
  ]);
});

test("country/:code (locale query parameter)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/country/ES",
    query: { locale: "es-ES" }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  t.has(payload.country_name, "España");
});

test("country/:code (accept-language header)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/country/ES",
    headers: { "accept-language": "de,es,es-ES;q=es,en;q=0.8,en-GB;q=0.7,en-US;q=0.6" }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  t.has(payload.country_name, "Spanien");
});

test("country/:code (not found)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/country/XX"
  });

  t.equal(res.statusCode, 404);
});

test("country/:code/geojson (alpha2)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/country/ES/geojson"
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
});

test("country/:code/geojson (alpha3)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/country/ESP/geojson"
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
});

test("country/:code/geojson (not found)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/country/XX/geojson"
  });

  t.equal(res.statusCode, 404);
});

test("country/:code/regions (alpha2)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/country/ES/regions"
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  for(const item of payload) {
    t.hasProps(item, [
      "country_a2",
      "region_code",
      "region_name"
    ]);
  }
});

test("country/:code/regions (alpha3)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/country/ESP/regions"
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  for(const item of payload) {
    t.hasProps(item, [
      "country_a2",
      "region_code",
      "region_name"
    ]);
  }
});

test("country/:code/regions (not found)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/country/XX/regions"
  });

  t.equal(res.statusCode, 404);
});
