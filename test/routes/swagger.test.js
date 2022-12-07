"use strict";

const { test } = require("tap");
const { build } = require("../helper");

test("swagger ui index", async (t) => {
  const app = await build(t);

  const redirect = await app.inject({
    url: "/"
  });

  t.equal(redirect.statusCode, 302);

  const res = await app.inject({
    url: redirect.headers.location
  });

  t.equal(res.statusCode, 200);
  t.match(res.headers["content-type"], /^text\/html/);
  t.match(res.payload, /swagger-ui/);
});
