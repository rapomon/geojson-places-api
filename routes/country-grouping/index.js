"use strict";
const { getCountryGroupings, getCountryGroupingByCode, getCountryGroupingGeoJSONByCode, getCountriesByCountryGroupingCode } = require("geojson-places");
const { getBestLocale } = require("../../utils/locale");
const { queryLocale, querySimplified, paramsCountryGroupingsByCode, countryGrouping, countryGroupings, countries, geojson } = require("../../utils/schema");

module.exports = async (fastify, opts) => {

  fastify.get("/", {
    schema: {
      description: "Get all country groupings.",
      tags: ["Country grouping"],
      summary: "Get country groupings",
      query: { ...queryLocale },
      response: {
        200: { ...countryGroupings }
      }
    }
  }, async (request, reply) => {
    const { locale } = request.query;
    const result = getCountryGroupings(locale);
    return result;
  });

  fastify.get("/:code", {
    schema: {
      description: "Get the country grouping by code.",
      tags: ["Country grouping"],
      summary: "Get country grouping by code",
      params: { ...paramsCountryGroupingsByCode },
      query: { ...queryLocale },
      response: {
        200: { ...countryGrouping },
        404: {}
      }
    }
  }, async (request, reply) => {
    const { code } = request.params;
    const { locale } = request.query;
    const result = getCountryGroupingByCode(code.toUpperCase(), getBestLocale(request, locale));
    if(!result || Object.keys(result).length === 0) {
      reply.code(404).send();
    } else {
      return result;
    }
  });

  fastify.get("/:code/geojson", {
    schema: {
      description: "Get the country grouping GeoJSON by code.",
      tags: ["Country grouping"],
      summary: "Get country grouping GeoJSON by code",
      params: { ...paramsCountryGroupingsByCode },
      query: { ...querySimplified },
      response: {
        200: { ...geojson },
        404: {}
      }
    }
  }, async (request, reply) => {
    const { code } = request.params;
    const { simplified } = request.query;
    const result = getCountryGroupingGeoJSONByCode(code.toUpperCase(), simplified);
    if(!result || Object.keys(result).length === 0) {
      reply.code(404).send();
    } else {
      return result;
    }
  });

  fastify.get("/:code/countries", {
    schema: {
      description: "Get the country list of the specified country grouping code.",
      tags: ["Country grouping"],
      summary: "Get country list by country grouping code",
      params: { ...paramsCountryGroupingsByCode },
      query: { ...queryLocale },
      response: {
        200: { ...countries },
        404: {}
      }
    }
  }, async (request, reply) => {
    const { code } = request.params;
    const { locale } = request.query;
    const result = getCountriesByCountryGroupingCode(code.toUpperCase(), getBestLocale(request, locale));
    if(!result) {
      reply.code(404).send();
    } else {
      return result;
    }
  });

};