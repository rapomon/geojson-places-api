"use strict";
const { getCountries, getCountryByAlpha2, getCountryByAlpha3, getCountryGeoJSONByAlpha2, getCountryGeoJSONByAlpha3, getRegionsByCountryAlpha2, getRegionsByCountryAlpha3 } = require("geojson-places");
const { getBestLocale } = require("../../utils/locale");
const { queryLocale, paramsCountriesByCode, country, countries, regions, geojson } = require("../../utils/schema");

module.exports = async (fastify, opts) => {

  fastify.get("/", {
    schema: {
      description: "Get all countries.",
      tags: ["Country"],
      summary: "Get countries",
      query: { ...queryLocale },
      response: {
        200: { ...countries }
      }
    }
  }, async (request, reply) => {
    const { locale } = request.query;
    const result = getCountries(locale);
    return result;
  });

  fastify.get("/:code", {
    schema: {
      description: "Get the country from the alpha2 (iso-3166-2) or alpha3 (iso-3166-3) code if code length > 2.",
      tags: ["Country"],
      summary: "Get country by code",
      params: { ...paramsCountriesByCode },
      query: { ...queryLocale },
      response: {
        200: { ...country },
        404: {}
      }
    }
  }, async (request, reply) => {
    const { code } = request.params;
    const { locale } = request.query;
    const fn = code.length > 2 ? getCountryByAlpha3 : getCountryByAlpha2;
    const result = fn(code.toUpperCase(), getBestLocale(request, locale));
    if(!result || Object.keys(result).length === 0) {
      reply.code(404).send();
    } else {
      return result;
    }
  });

  fastify.get("/:code/regions", {
    schema: {
      description: "Get regions of the specified country by the alpha2 (iso-3166-2) or alpha3 (iso-3166-3) code if code length > 2.",
      tags: ["Country"],
      summary: "Get regions by country code",
      params: { ...paramsCountriesByCode },
      query: { ...queryLocale },
      response: {
        200: { ...regions },
        404: {}
      }
    }
  }, async (request, reply) => {
    const { code } = request.params;
    const { locale } = request.query;
    const fnCountry = code.length > 2 ? getCountryByAlpha3 : getCountryByAlpha2;
    const country = fnCountry(code.toUpperCase());
    if(!country || Object.keys(country).length === 0) {
      reply.code(404).send();
    } else {
      const fnRegions = code.length > 2 ? getRegionsByCountryAlpha3 : getRegionsByCountryAlpha2;
      const result = fnRegions(code.toUpperCase(), getBestLocale(request, locale));
      return result;
    }
  });

  fastify.get("/:code/geojson", {
    schema: {
      description: "Get the country GeoJSON from the alpha2 (iso-3166-2) or alpha3 (iso-3166-3) code if code length > 2.",
      tags: ["Country"],
      summary: "Get country GeoJSON by code",
      params: { ...paramsCountriesByCode },
      response: {
        200: { ...geojson },
        404: {}
      }
    }
  }, async (request, reply) => {
    const { code } = request.params;
    const fn = code.length > 2 ? getCountryGeoJSONByAlpha3 : getCountryGeoJSONByAlpha2;
    const result = fn(code.toUpperCase());
    if(!result || Object.keys(result).length === 0) {
      reply.code(404).send();
    } else {
      return result;
    }
  });

};