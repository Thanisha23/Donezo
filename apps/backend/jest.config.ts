import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js"],
  verbose: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
};

export default config;
