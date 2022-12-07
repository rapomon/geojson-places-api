"use strict";
const { getContinents, getContinentByCode, getContinentGeoJSONByCode, getCountriesByContinentCode } = require("geojson-places");
const { getBestLocale } = require("../../utils/locale");
const { queryLocale, querySimplified, paramsContinentByCode, continent, continents, countries, geojson } = require("../../utils/schema");

module.exports = async (fastify, opts) => {

  fastify.get("/", {
    schema: {
      description: "Get all continents.",
      tags: ["Continent"],
      summary: "Get continents",
      query: { ...queryLocale },
      response: {
        200: { ...continents }
      }
    }
  }, async (request, reply) => {
    const { locale } = request.query;
    const result = getContinents(locale);
    return result;
  });

  fastify.get("/:code", {
    schema: {
      description: "Get the continent from the continent code.",
      tags: ["Continent"],
      summary: "Get continent by code",
      params: { ...paramsContinentByCode },
      query: { ...queryLocale },
      response: {
        200: { ...continent },
        404: {}
      }
    }
  }, async (request, reply) => {
    const { code } = request.params;
    const { locale } = request.query;
    const result = getContinentByCode(code.toUpperCase(), getBestLocale(request, locale));
    if(!result || Object.keys(result).length === 0) {
      reply.code(404).send();
    } else {
      return result;
    }
  });

  fastify.get("/:code/geojson", {
    schema: {
      description: "Get the continent GeoJSON from the continent code.",
      tags: ["Continent"],
      summary: "Get continent GeoJSON by code",
      params: { ...paramsContinentByCode },
      query: { ...querySimplified },
      response: {
        200: { ...geojson },
        404: {}
      }
    }
  }, async (request, reply) => {
    const { code } = request.params;
    const { simplified } = request.query;
    const result = getContinentGeoJSONByCode(code.toUpperCase(), simplified);
    if(!result || Object.keys(result).length === 0) {
      reply.code(404).send();
    } else {
      return result;
    }
  });

  fastify.get("/:code/countries", {
    schema: {
      description: "Get the continent countries from the continent code.",
      tags: ["Continent"],
      summary: "Get continent countries by code",
      params: { ...paramsContinentByCode },
      query: { ...queryLocale },
      response: {
        200: { ...countries },
        404: {}
      }
    }
  }, async (request, reply) => {
    const { code } = request.params;
    const { locale } = request.query;
    const result = getCountriesByContinentCode(code.toUpperCase(), getBestLocale(request, locale));
    if(!result) {
      reply.code(404).send();
    } else {
      return result;
    }
  });
};