function parseAcceptLanguageTag(tag) {
  tag = tag.split(";");
  const el = {
    value: tag[0].trim(),
    q: tag[1]
  };
  if(!el.value) {
    return;
  }

  const lang = el.value.split("-");

  el.language = lang[0];
  el.region = (lang[1] || "").toUpperCase();
  if(!el.q) {
    el.q = 1;
  } else {
    el.q = parseFloat(el.q.slice(2));
    if(isNaN(el.q)) {
      el.q = 1;
    }
  }
  return el;
}

// parse Accept-Language header with memoization
function parseAcceptLanguage(req) {
  const acceptLanguage = req.headers["accept-language"];
  return (acceptLanguage || "").split(",")
    .map(parseAcceptLanguageTag)
    .filter(Boolean)  // filter empty
    .sort((a, b) => b.q - a.q);
}

function getBestLocale(req, locale) {
  let result = locale;
  if(typeof result !== "string") {
    const parsed = parseAcceptLanguage(req);
    if(parsed instanceof Array && parsed.length > 0) {
      result = parsed[0].value;
    }
  }
  if(typeof result === "string") {
    result = result.toLowerCase();
    if(result.indexOf("-") !== -1) {
      result = result.replace("-", "_");
    }
    if(result.indexOf("_") !== -1) {
      result = result.split("_")[0];
    }
  }
  if(!result) {
    result = "en";
  }
  return result;
}

module.exports = {
  parseAcceptLanguageTag,
  parseAcceptLanguage,
  getBestLocale
};