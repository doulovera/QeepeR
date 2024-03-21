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
  },
  NOT_FOUND: {
    TITLE: "Not Found",
    MESSAGE: "The requested resource was not found.",
  },
  UNAUTHORIZED: {
    TITLE: "Unauthorized",
    MESSAGE: "You are not authorized to access this resource.",
  },
}