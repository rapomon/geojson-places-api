"use strict";
const { getRegions, getRegionByCode, getRegionGeoJSONByCode, getStatesByRegionCode, getRegionsAndStates } = require("geojson-places");
const { getBestLocale } = require("../../utils/locale");
const { queryLocale, paramsRegionByCode, region, regions, states, regionsAndStates, geojson } = require("../../utils/schema");

module.exports = async (fastify, opts) => {

  fastify.get("/", {
    schema: {
      description: "Get a list of all regions.",
      tags: ["Region"],
      summary: "Get all regions",
      query: { ...queryLocale },
      response: {
        200: { ...regions }
      }
    }
  }, async (request, reply) => {
    const { locale } = request.query;
    const result = getRegions(locale);
    return result;
  });

  fastify.get("/states", {
    schema: {
      description: "Get a list of all regions with the states of each region.",
      tags: ["Region"],
      summary: "Get all regions with their states",
      query: { ...queryLocale },
      response: {
        200: { ...regionsAndStates }
      }
    }
  }, async (request, reply) => {
    const { locale } = request.query;
    const result = getRegionsAndStates(locale);
    return result;
  });

  fastify.get("/:code", {
    schema: {
      description: "Get the region by code.",
      tags: ["Region"],
      summary: "Get region by code",
      params: { ...paramsRegionByCode },
      query: { ...queryLocale },
      response: {
        200: { ...region },
        404: {}
      }
    }
  }, async (request, reply) => {
    const { code } = request.params;
    const { locale } = request.query;
    const result = getRegionByCode(code.toUpperCase(), getBestLocale(request, locale));
    if(!result || Object.keys(result).length === 0) {
      reply.code(404).send();
    } else {
      return result;
    }
  });

  fastify.get("/:code/states", {
    schema: {
      description: "Get a list of states of the specified region by code.",
      tags: ["Region"],
      summary: "Get states by region code",
      params: { ...paramsRegionByCode },
      query: { ...queryLocale },
      response: {
        200: { ...states },
        404: {}
      }
    }
  }, async (request, reply) => {
    const { code } = request.params;
    const { locale } = request.query;
    const result = getStatesByRegionCode(code.toUpperCase(), getBestLocale(request, locale));
    if(!result) {
      reply.code(404).send();
    } else {
      return result;
    }
  });

  fastify.get("/:code/geojson", {
    schema: {
      description: "Get the region GeoJSON by code.",
      tags: ["Region"],
      summary: "Get region GeoJSON by code",
      params: { ...paramsRegionByCode },
      response: {
        200: { ...geojson },
        404: {}
      }
    }
  }, async (request, reply) => {
    const { code } = request.params;
    const result = getRegionGeoJSONByCode(code.toUpperCase());
    if(!result || Object.keys(result).length === 0) {
      reply.code(404).send();
    } else {
      return result;
    }
  });

};