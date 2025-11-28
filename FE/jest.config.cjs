module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.jest.json" }],
  },
  moduleNameMapper: {
    "^.+\\.(css|scss|sass)$": "<rootDir>/jest.styleMock.js",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: "jsdom",
  transformIgnorePatterns: ["node_modules"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
