"use strict";

const { test } = require("tap");
const { build } = require("../helper");

test("region", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/region"
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  t.not(payload.length, 0);
  t.hasProps(payload[0], [
    "country_a2",
    "region_code",
    "region_name"
  ]);
});

test("region/states", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/region/states"
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  t.not(payload.length, 0);
  t.hasProps(payload[0], [
    "country_a2",
    "region_code",
    "region_name",
    "states"
  ]);
  for(const item of payload[0].states) {
    t.hasProps(item, [
      "state_code",
      "state_name"
    ]);
  }
});

test("region/:code", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/region/ES-CL"
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  t.hasProps(payload, [
    "country_a2",
    "region_code",
    "region_name"
  ]);
});

test("region/:code (locale query parameter)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/region/ES-CL",
    query: { locale: "es-ES" }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  t.has(payload.region_name, "Castilla y León");
});

test("region/:code (accept-language header)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/region/ES-CL",
    headers: { "accept-language": "en,es,es-ES;q=es,en;q=0.8,en-GB;q=0.7,en-US;q=0.6" }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  t.has(payload.region_name, "Castile and León");
});

test("region/:code (not found)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/region/XX-XX"
  });

  t.equal(res.statusCode, 404);
});

test("region/:code/states", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/region/ES-CL/states"
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
  t.not(payload.length, 0);
  for(const item of payload) {
    t.hasProps(item, [
      "state_code",
      "state_name"
    ]);
  }
});

test("region/:code/states (not found)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/region/XX-XX/states"
  });

  t.equal(res.statusCode, 404);
});

test("region/:code/geojson", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/region/ES-CL/geojson"
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");
});

test("region/:code/geojson (not found)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/region/XX-XX/geojson"
  });

  t.equal(res.statusCode, 404);
});
