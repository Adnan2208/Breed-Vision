/**
 * Application Constants
 */

const USER_ROLES = {
  ADMIN: "admin",
  FLW: "flw", // Field Level Worker
  GOVT_OFFICIAL: "govt_official",
  VETERINARIAN: "veterinarian",
};

const CATTLE_GENDER = {
  MALE: "male",
  FEMALE: "female",
};

const LACTATION_STATUS = {
  LACTATING: "lactating",
  DRY: "dry",
  NOT_APPLICABLE: "not_applicable",
};

const VACCINATION_STATUS = {
  VACCINATED: "vaccinated",
  PARTIALLY_VACCINATED: "partially_vaccinated",
  NOT_VACCINATED: "not_vaccinated",
  UNKNOWN: "unknown",
};

const SUPPORTED_LANGUAGES = {
  EN: "en",
  HI: "hi",
  TA: "ta",
  TE: "te",
  KN: "kn",
  MR: "mr",
  GU: "gu",
  BN: "bn",
  PA: "pa",
  OR: "or",
};

const HEALTH_ISSUES = [
  "fever",
  "diarrhea",
  "respiratory_infection",
  "mastitis",
  "foot_and_mouth",
  "lumpy_skin_disease",
  "tick_infestation",
  "worm_infestation",
  "bloat",
  "milk_fever",
  "ketosis",
  "none",
];

module.exports = {
  USER_ROLES,
  CATTLE_GENDER,
  LACTATION_STATUS,
  VACCINATION_STATUS,
  SUPPORTED_LANGUAGES,
  HEALTH_ISSUES,
};
