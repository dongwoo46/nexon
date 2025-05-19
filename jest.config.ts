import { compilerOptions } from './tsconfig.json';
import { pathsToModuleNameMapper } from 'ts-jest';

export default {
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@libs/dto$': '<rootDir>/libs/dto/src',
    '^@libs/dto/(.*)$': '<rootDir>/libs/dto/src/$1',
    '^@libs/constants$': '<rootDir>/libs/constants',
    '^@libs/constants/(.*)$': '<rootDir>/libs/constants/$1',
    '^@libs/(.*)$': '<rootDir>/libs/$1',
    '^apps/(.*)$': '<rootDir>/apps/$1',
  },
  testEnvironment: 'node',
};
