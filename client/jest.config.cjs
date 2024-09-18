/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
	testEnvironment: "jsdom",
	transform: {
		"^.+\\.(js|jsx|ts|tsx)$": "@swc/jest",
	},
	collectCoverage: true,
	coverageThreshold: {
		global: {
			branches: 70,
			functions: 80,
			lines: 80,
			statements: 70,
		},
	},
	collectCoverageFrom: ["./app"],
};
