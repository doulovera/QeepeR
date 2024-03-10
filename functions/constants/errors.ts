export const API_RESPONSE = {
  MISSING_BODY: {
    TITLE: "Missing Body",
    MESSAGE: "The request body is missing.",
  },
  MISSING_BODY_KEY: {
    TITLE: "Missing Body Key",
    MESSAGE(key: string) {
      return `The request body is missing the key: ${key}`;
    }
  }
}