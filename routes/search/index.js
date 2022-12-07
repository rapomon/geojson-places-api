"use strict";
const { lookUp, lookUpGeoJSON, lookUpRaw, getContinents, getCountryGroupings, getCountries, getRegionsAndStates } = require("geojson-places");
const removeDiacritics = require("diacritics").remove;
const { querySearch, querySearchReverse, search, place, geojson } = require("../../utils/schema");
const { getBestLocale } = require("../../utils/locale");
const { searchText } = require("../../utils/search");

module.exports = async (fastify, opts) => {
  fastify.get("/", {
    schema: {
      description: "Search places by a search criteria over continents, country groupings, countries, regions and states.",
      tags: ["Search"],
      summary: "Search places by text",
      query: { ...querySearch },
      response: {
        200: { ...search }
      }
    }
  }, async (request, reply) => {

    const { q, type, limit, locale, exact } = request.query;
    const bestLocale = getBestLocale(request, locale);

    let query = [];
    if(typeof q === "string" && q !== "") {
      if(exact) {
        query = [ removeDiacritics(q).toLowerCase().trim() ];
      } else {
        query = q
          .toLowerCase()
          .split(" ")
          .map(r => removeDiacritics(r.trim()))
          .filter(r => r !== "");
      }
    }

    let results = [];
    let remainingLimit = limit;

    if(query.length > 0) {

      // Search for continents
      let continentResult = [];
      if(!type || type.length === 0 || type.includes("continent")) {
        let continents = getContinents(bestLocale);
        for(const c of continents) {
          if(searchText(c.continent_code, query) || searchText(c.continent_name, query, true)) {
            continentResult.push({
              type: "continent",
              code: c.continent_code,
              name: c.continent_name
            });
            remainingLimit--;
            if(remainingLimit === 0) break;
          }
        }
      }

      // Search for country groupings
      let countryGroupingResult = [];
      if(remainingLimit > 0 && (!type || type.length === 0 || type.includes("country_grouping"))) {
        let countryGroupings = getCountryGroupings(bestLocale);
        for(const cg of countryGroupings) {
          if(searchText(cg.grouping_code, query) || searchText(cg.grouping_name, query, true)) {
            countryGroupingResult.push({
              type: "country_grouping",
              code: cg.grouping_code,
              name: cg.grouping_name
            });
            remainingLimit--;
            if(remainingLimit === 0) break;
          }
        }
      }

      // Search for countries
      let countryResult = [];
      if(remainingLimit > 0 && (!type || type.length === 0 || type.includes("country"))) {
        let countries = getCountries(bestLocale);
        for(const c of countries) {
          if(searchText(c.country_a2, query) || searchText(c.country_a3, query) || searchText(c.country_name, query, true)) {
            countryResult.push({
              type: "country",
              code: c.country_a2,
              name: c.country_name
            });
            remainingLimit--;
            if(remainingLimit === 0) break;
          }
        }
      }

      // Search for regions of each country
      let regionResult = [];
      let stateResult = [];
      if(remainingLimit > 0 && (!type || type.length === 0 || type.includes("region") || type.includes("state"))) {
        let regions = getRegionsAndStates(bestLocale);

        for(const re of regions) {
          if(!type || type.length === 0 || type.includes("region")) {
            if(searchText(re.region_code, query) || searchText(re.region_name, query, true)) {
              regionResult.push({
                type: "region",
                code: re.region_code,
                name: re.region_name
              });
              remainingLimit--;
              if(remainingLimit === 0) break;
            }
          }

          if(re.states && (!type || type.length === 0 || type.includes("state"))) {
            for(const s of re.states) {
              if(searchText(s.state_code, query) || searchText(s.state_name, query, true)) {
                stateResult.push({
                  type: "state",
                  code: s.state_code,
                  name: s.state_name
                });
                remainingLimit--;
                if(remainingLimit === 0) break;
              }
            }
          }
          if(remainingLimit === 0) break;
        }
      }

      results = [
        ...continentResult,
        ...countryGroupingResult,
        ...countryResult,
        ...regionResult,
        ...stateResult
      ];
    }

    return results;
  });

  fastify.get("/reverse", {
    schema: {
      description: "Reverse geocoding to get the region info from latitude/longitude arguments.",
      tags: ["Search"],
      summary: "Look up place from latitude/longitude",
      query: { ...querySearchReverse },
      response: {
        200: { ...place },
        404: {}
      }
    }
  }, async (request, reply) => {
    // Reverse geocoding to get the region info
    const { lat, lon } = request.query;
    const result = lookUp(lat, lon);
    if(!result || Object.keys(result).length === 0) {
      reply.code(404).send();
    } else {
      return result;
    }
  });

  fastify.get("/reverse/geojson", {
    schema: {
      description: "Reverse geocoding to get the region geojson from latitude/longitude arguments.",
      tags: ["Search"],
      summary: "Look up the geojson from latitude/longitude",
      query: { ...querySearchReverse },
      response: {
        200: { ...geojson },
        404: {}
      }
    }
  }, async (request, reply) => {
    // Reverse geocoding to get the region info
    const { lat, lon } = request.query;
    const result = lookUpGeoJSON(lat, lon);
    if(!result || Object.keys(result).length === 0) {
      reply.code(404).send();
    } else {
      return result;
    }
  });

  fastify.get("/reverse/raw", {
    schema: {
      description: "Reverse geocoding to get the region geojson with raw data from latitude/longitude arguments.",
      tags: ["Search"],
      summary: "Look up the geojson with raw data from latitude/longitude",
      query: { ...querySearchReverse },
      response: {
        200: { ...geojson },
        404: {}
      }
    }
  }, async (request, reply) => {
    // Reverse geocoding to get the region info
    const { lat, lon } = request.query;
    const result = lookUpRaw(lat, lon);
    if(!result || Object.keys(result).length === 0) {
      reply.code(404).send();
    } else {
      return result;
    }
  });
};
