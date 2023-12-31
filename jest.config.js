module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['./tests'],
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
    verbose: true,
};
