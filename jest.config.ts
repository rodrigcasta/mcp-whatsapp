import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  roots: ["<rootDir>/test"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  collectCoverageFrom: ["app/**/*.ts", "!app/programa-*.ts"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: ["text", "cobertura"],
  reporters: ["default", ["jest-html-reporter", { outputPath: "./reports/test-report.html" }]],
};

export default config;
