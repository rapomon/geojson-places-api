"use strict";

const { test } = require("tap");
const { build } = require("../helper");

test("search", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/search",
    query: {
      q: "ro",
      type: [], // Search all types
      limit: 5
    }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.equal(payload.length, 5);
  t.type(payload, "object");
  for(const item of payload) {
    t.hasProps(item, [
      "type",
      "code",
      "name"
    ]);
  }

});

test("search (continent)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/search",
    query: {
      q: "r",
      type: ["continent"], // Search all types
      limit: 1
    }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.equal(payload.length, 1);
  t.type(payload, "object");

});

test("search (country)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/search",
    query: {
      q: "a",
      type: ["country"],
      limit: 10
    }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.equal(payload.length, 10);
  t.type(payload, "object");
  for(const item of payload) {
    t.has(item.type, "country");
  }

});

test("search (region)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/search",
    query: {
      q: "Castilla y León",
      locale: "es",
      limit: 10
    }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.not(payload.length, 0);
  t.type(payload, "object");
  t.has(payload[0].type, "region");
  t.has(payload[0].code, "ES-CL");
  t.has(payload[0].name, "Castilla y León");

});

test("search (region - exact true)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/search",
    query: {
      q: "Castilla León",
      exact: true,
      locale: "es",
      limit: 10
    }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.equal(payload.length, 0);

});

test("search (region - exact false)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/search",
    query: {
      q: "Castilla León",
      exact: false,
      locale: "es",
      limit: 10
    }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.equal(payload.length, 1);

});

test("search (all - one result)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/search",
    query: {
      q: "Castilla",
      exact: true,
      locale: "es",
      limit: 1
    }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.equal(payload.length, 1);

});

test("search (state)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/search",
    query: {
      q: "Valladolid",
      type: ["state"],
      exact: true,
      locale: "es",
      limit: 10
    }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.equal(payload.length, 1);

});

test("search (state - one result)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/search",
    query: {
      q: "Valladolid",
      type: ["state"],
      exact: true,
      locale: "es",
      limit: 1
    }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.equal(payload.length, 1);

});

test("search (region and state - two results)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/search",
    query: {
      q: "Madrid",
      type: ["region", "state"],
      exact: true,
      locale: "es",
      limit: 2
    }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.equal(payload.length, 2);
});

test("search (region - one result)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/search",
    query: {
      q: "Madrid",
      type: ["region"],
      exact: true,
      locale: "es",
      limit: 10
    }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.equal(payload.length, 1);
});

test("search (empty string)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/search",
    query: {}
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.equal(payload.length, 0);

});

test("search reverse", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/search/reverse",
    query: {
      lat: 30,
      lon: -3
    }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");

});

test("search reverse (not found)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/search/reverse",
    query: {
      lat: 0,
      lon: 0
    }
  });

  t.equal(res.statusCode, 404);

});

test("search reverse (geojson)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/search/reverse/geojson",
    query: {
      lat: 30,
      lon: -3
    }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");

});

test("search reverse (geojson) (not found)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/search/reverse/geojson",
    query: {
      lat: 0,
      lon: 0
    }
  });

  t.equal(res.statusCode, 404);

});

test("search reverse (raw)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/search/reverse/raw",
    query: {
      lat: 30,
      lon: -3
    }
  });

  t.equal(res.statusCode, 200);
  const payload = JSON.parse(res.payload);
  t.type(payload, "object");

});

test("search reverse (raw) (not found)", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/search/reverse/raw",
    query: {
      lat: 0,
      lon: 0
    }
  });

  t.equal(res.statusCode, 404);

});
