"use strict";
const { getStateByCode, getStateGeoJSONByCode } = require("geojson-places");
const { getBestLocale } = require("../../utils/locale");
const { queryLocale, paramsStateByCode, state, geojson } = require("../../utils/schema");

module.exports = async (fastify, opts) => {

  fastify.get("/:code", {
    schema: {
      description: "Get the state by code.",
      tags: ["State"],
      summary: "Get state by code",
      params: { ...paramsStateByCode },
      query: { ...queryLocale },
      response: {
        200: { ...state },
        404: {}
      }
    }
  }, async (request, reply) => {
    const { code } = request.params;
    const { locale } = request.query;
    const result = getStateByCode(code.toUpperCase(), getBestLocale(request, locale));
    if(!result || Object.keys(result).length === 0) {
      reply.code(404).send();
    } else {
      return result;
    }
  });

  fastify.get("/:code/geojson", {
    schema: {
      description: "Get the state GeoJSON by code.",
      tags: ["State"],
      summary: "Get state GeoJSON by code",
      params: { ...paramsStateByCode },
      response: {
        200: { ...geojson },
        404: {}
      }
    }
  }, async (request, reply) => {
    const { code } = request.params;
    const result = getStateGeoJSONByCode(code.toUpperCase());
    if(!result || Object.keys(result).length === 0) {
      reply.code(404).send();
    } else {
      return result;
    }
  });
};