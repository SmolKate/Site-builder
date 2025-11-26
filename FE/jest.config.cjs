module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testEnvironment: "jsdom",
  transformIgnorePatterns: ["node_modules"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|scss|sass)$": "<rootDir>/jest.styleMock.cjs",
  },
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.app.json",
      diagnostics: false,
    },
  },
};
