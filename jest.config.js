module.exports = {
    testEnvironment : "node",
    displayName: {
        name: "blockr-logger",
        color: "blue"
    },
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    testMatch: [
        "**/__tests__/**/*.test.+(ts|tsx)"
    ],
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/index.ts",
        "!src/__tests__/**/*"
    ],
    reporters: [
        "default",
        "jest-junit"
    ],
    coverageReporters: [
        "text",
        "lcov",
        "cobertura"
    ]
}