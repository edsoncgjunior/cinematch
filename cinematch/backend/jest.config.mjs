/** @type {import("jest").Config} */
export default {
  testEnvironment: "node",
  transform: {},
  moduleFileExtensions: ["js","json"],
  roots: ["<rootDir>/tests"],
  testMatch: ["**/?(*.)+(test).[jt]s"],
  verbose: true
}
