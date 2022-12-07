"use strict";

const path = require("path");
const AutoLoad = require("@fastify/autoload");
const Etag = require("@fastify/etag");
const swagger = require("@fastify/swagger");
const swaggerUi = require("@fastify/swagger-ui");

// Pass --options via CLI arguments in command to enable these options.
module.exports.options = {};

module.exports = async (fastify, opts) => {

  // Endpoints return a 304 if the ETag matches
  await fastify.register(Etag);

  // Place here your custom code!
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "API for GeoJSON places",
        description: "API developed with <a href=\"https://www.fastify.io\" target=\"_blank\">fastify</a> framework, using the library <a href=\"https://github.com/rapomon/geojson-places\" target=\"_blank\">geojson-places</a> as example",
        version: "1.0.0"
      },
      host: "localhost:3000",
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"]
    },
    hideUntagged: true,
    exposeRoute: true
  });

  await fastify.register(swaggerUi, {
    routePrefix: "/",
    uiConfig: {
    },
    uiHooks: {
      onRequest: function(request, reply, next) { next(); },
      preHandler: function(request, reply, next) { next(); }
    },
    staticCSP: true,
    transformSpecificationClone: true
  });

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}, opts)
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({}, opts)
  });

};
