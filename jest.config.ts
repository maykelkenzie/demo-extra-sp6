/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https:
 */

export default {
  coverageProvider: "v8",
  preset: "ts-jest",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "/mocks/"],
};
