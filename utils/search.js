"use strict";
const removeDiacritics = require("diacritics").remove;

function searchText(field, text, diacritics = false) {
  let found = false;
  let value = diacritics ? removeDiacritics(field) : field;
  value = value.toLowerCase();
  for(const t of text) {
    if(value.indexOf(t) === -1) {
      found = false;
      break;
    } else {
      found = true;
    }
  }
  return found;
}

module.exports = {
  searchText
};
