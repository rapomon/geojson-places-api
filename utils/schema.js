"use strict";

const placeTypes = [
  "continent",
  "country_grouping",
  "country",
  "region",
  "state"
];

const paramsContinentByCode = {
  type: "object",
  required: ["code"],
  properties: {
    code: {
      description: "Continent code",
      type: "string"
    }
  }
};

const paramsCountryGroupingsByCode = {
  type: "object",
  required: ["code"],
  properties: {
    code: {
      description: "Country grouping code",
      type: "string"
    }
  }
};

const paramsCountriesByCode = {
  type: "object",
  required: ["code"],
  properties: {
    code: {
      description: "Country alpha2 (iso-3166-2) or alpha3 (iso-3166-3) code",
      type: "string"
    }
  }
};

const paramsRegionByCode = {
  type: "object",
  required: ["code"],
  properties: {
    code: {
      description: "Region code",
      type: "string"
    }
  }
};

const paramsStateByCode = {
  type: "object",
  required: ["code"],
  properties: {
    code: {
      description: "State code",
      type: "string"
    }
  }
};

const querySearch = {
  type: "object",
  properties: {
    q: {
      type: "string",
      description: "Search criteria (search in codes and names)"
    },
    type: {
      type: "array",
      description: "Array of place types to search (all types by default)",
      items: {
        type: "string",
        enum: [ ...placeTypes ]
      }
    },
    exact: {
      type: "boolean",
      description: "Codes or names must contain the search criteria, otherwise the criteria will be split into words, each word must be contained inside codes or names (`false` by default)",
      default: false
    },
    limit: {
      type: "number",
      description: "Limit search results (`100` by default)",
      default: 100,
      maximum: 1000
    },
    locale: {
      type: "string",
      description: "Locale used for names (accept-language header will be used by default)"
    }
  }
};

const querySearchReverse = {
  type: "object",
  required: ["lat", "lon"],
  properties: {
    lat: {
      description: "Latitude",
      type: "number"
    },
    lon: {
      description: "Longitude",
      type: "number"
    }
  }
};

const queryLocale = {
  type: "object",
  properties: {
    locale: {
      description: "Locale used for place names (client accept-language header by default)",
      type: "string"
    }
  }
};

const querySimplified = {
  type: "object",
  properties: {
    simplified: {
      description: "A simplified version of GeoJSON object (less coords) can be retrieved if simplified argument is true.",
      type: "boolean",
      default: false
    }
  }
};

const place = {
  type: "object",
  properties: {
    continent_code: {
      description: "Continent code",
      type: "string"
    },
    country_a2: {
      description: "Country alpha2 iso-3166-2 code",
      type: "string"
    },
    country_a3: {
      description: "Country alpha3 iso-3166-3 code",
      type: "string"
    },
    region_code: {
      description: "Region code",
      type: "string"
    },
    state_code: {
      description: "State code",
      type: "string"
    },
  }
};

const continent = {
  type: "object",
  properties: {
    continent_code: {
      description: "Continent code",
      type: "string"
    },
    continent_name: {
      description: "Continent name",
      type: "string"
    },
    countries: {
      description: "List of alpha2 iso-3166-2 country codes inside the continent",
      type: "array",
      items: {
        type: "string"
      }
    },
  }
};

const continents = {
  type: "array",
  items: { ...continent }
};

const countryGrouping = {
  type: "object",
  properties: {
    grouping_code: {
      description: "Country grouping code",
      type: "string"
    },
    grouping_name: {
      description: "Country grouping name",
      type: "string"
    },
    countries: {
      description: "Array of alpha2 iso-3166-2 country codes",
      type: "array",
      items: {
        type: "string"
      }
    },
  }
};

const countryGroupings = {
  type: "array",
  items: { ...countryGrouping }
};

const country = {
  type: "object",
  properties: {
    country_a2: {
      description: "Country alpha2 iso-3166-2 code",
      type: "string"
    },
    country_a3: {
      description: "Country alpha3 iso-3166-3 code",
      type: "string"
    },
    country_name: {
      description: "Country name",
      type: "string"
    },
  }
};

const countries = {
  type: "array",
  items: { ...country }
};

const region = {
  type: "object",
  properties: {
    country_a2: {
      description: "Country alpha2 iso-3166-2 code",
      type: "string"
    },
    region_code: {
      description: "Region code",
      type: "string"
    },
    region_name: {
      description: "Region name",
      type: "string"
    },
  }
};

const regions = {
  type: "array",
  items: { ...region }
};

const state = {
  type: "object",
  properties: {
    state_code: {
      description: "State code",
      type: "string"
    },
    state_name: {
      description: "State name",
      type: "string"
    },
  }
};

const states = {
  type: "array",
  items: { ...state }
};

const regionAndStates = {
  type: "object",
  properties: {
    ...region.properties,
    states: {
      type: "array",
      items: { ...state }
    }
  }
};

const regionsAndStates = {
  type: "array",
  items: { ...regionAndStates }
};

const geojson = {
  type: "object",
  description: "GeoJSON",
  properties: {
    type: {
      type: "string"
    },
    features: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string"
          },
          properties: {
            description: "Place basic data"
          },
          geometry: {
            type: "object",
            properties: {
              type: {
                type: "string"
              },
              coordinates: {}
            }
          }
        }
      }
    }
  }
};

const search = {
  type: "array",
  items: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: [ ...placeTypes ]
      },
      code: {
        type: "string"
      },
      name: {
        type: "string"
      }
    }
  }
};

module.exports = {
  placeTypes,
  continent,
  continents,
  countryGrouping,
  countryGroupings,
  country,
  countries,
  region,
  regions,
  state,
  states,
  regionAndStates,
  regionsAndStates,
  paramsContinentByCode,
  paramsCountryGroupingsByCode,
  paramsCountriesByCode,
  paramsRegionByCode,
  paramsStateByCode,
  querySearch,
  querySearchReverse,
  queryLocale,
  querySimplified,
  search,
  place,
  geojson
};