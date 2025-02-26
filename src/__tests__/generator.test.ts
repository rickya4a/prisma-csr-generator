import { GeneratorOptions } from '@prisma/generator-helper'
import { mkdir, writeFile } from 'fs/promises'
import { onGenerate } from '../generator'

// Mock fs/promises
jest.mock('fs/promises', () => ({
  mkdir: jest.fn(),
  writeFile: jest.fn(),
}))

describe('Generator', () => {
  const mockOptions: GeneratorOptions = {
    generator: {
      config: {},
      name: 'test',
      output: {
        value: '/output',
        fromEnvVar: null,
      },
      provider: {
        value: 'test-provider',
        fromEnvVar: null,
      },
      binaryTargets: [],
      previewFeatures: [],
      sourceFilePath: '',
    },
    dmmf: {
      datamodel: {
        models: [
          {
            name: 'User',
            dbName: null,
            fields: [
              {
                name: 'id',
                kind: 'scalar',
                type: 'Int',
                isId: true,
                isList: false,
                isRequired: true,
                isUnique: false,
                hasDefaultValue: true,
                default: { name: 'autoincrement', args: [] },
                isReadOnly: false,
              },
            ],
            uniqueFields: [],
            uniqueIndexes: [],
            primaryKey: null,
            schema: null,
          },
        ],
        enums: [],
        types: [],
        indexes: [],
      },
      schema: {
        inputObjectTypes: { prisma: [], model: [] },
        outputObjectTypes: { prisma: [], model: [] },
        enumTypes: { prisma: [], model: [] },
        fieldRefTypes: { prisma: [] },
      },
      mappings: {
        modelOperations: [],
        otherOperations: {
          read: [],
          write: [],
        },
      },
    },
    schemaPath: '',
    version: '1.0.0',
    datamodel: '',
    otherGenerators: [],
    binaryPaths: undefined,
    datasources: [],
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create directories and files for each model', async () => {
    await onGenerate(mockOptions)

    expect(mkdir).toHaveBeenCalledWith(
      expect.stringContaining('modules/user'),
      expect.any(Object)
    )

    expect(writeFile).toHaveBeenCalledTimes(4)
  })

  it('should throw error if no output directory specified', async () => {
    const invalidOptions = {
      ...mockOptions,
      generator: {
        ...mockOptions.generator,
        output: null,
      },
    }

    await expect(onGenerate(invalidOptions)).rejects.toThrow(
      'No output directory specified'
    )
  })
})
