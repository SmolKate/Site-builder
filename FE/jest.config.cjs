module.exports = {
  preset: "ts-jest",
  transform: {
    // eslint-disable-next-line no-useless-escape
    "^.+\.(ts|tsx|js|jsx)$": "ts-jest",
  },
  testEnvironment: "jsdom",
  transformIgnorePatterns: ["node_modules"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
