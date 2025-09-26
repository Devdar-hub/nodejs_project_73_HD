// /** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
// }


// jest.config.ts
import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'reports/junit',
        outputName: 'results.xml'
      }
    ]
  ]
}

export default config

