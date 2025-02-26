import { DMMF } from '@prisma/generator-helper'
import {
  generateControllerTemplate,
  generateServiceTemplate,
  generateRepositoryTemplate
} from '../helpers/templateHelper'

describe('Template Helper', () => {
  const mockModel: DMMF.Model = {
    name: 'User',
    dbName: null,
    fields: [
      {
        name: 'id',
        kind: 'scalar',
        isList: false,
        isRequired: true,
        isUnique: false,
        isId: true,
        isReadOnly: false,
        type: 'Int',
        hasDefaultValue: true,
        default: { name: 'autoincrement', args: [] },
        isGenerated: false,
        isUpdatedAt: false,
      },
      {
        name: 'email',
        kind: 'scalar',
        isList: false,
        isRequired: true,
        isUnique: true,
        isId: false,
        isReadOnly: false,
        type: 'String',
        hasDefaultValue: false,
        isGenerated: false,
        isUpdatedAt: false,
      },
      {
        name: 'name',
        kind: 'scalar',
        isList: false,
        isRequired: false,
        isUnique: false,
        isId: false,
        isReadOnly: false,
        type: 'String',
        hasDefaultValue: false,
        isGenerated: false,
        isUpdatedAt: false,
      }
    ],
    uniqueFields: [],
    uniqueIndexes: [],
    primaryKey: null,
    schema: null
  }

  describe('generateControllerTemplate', () => {
    it('should generate controller with correct types', () => {
      const result = generateControllerTemplate(mockModel)

      expect(result).toContain('export class UserController')
      expect(result).toContain('id: number')
      expect(result).toContain('email: string')
      expect(result).toContain('name?: string')
    })

    it('should include all CRUD methods', () => {
      const result = generateControllerTemplate(mockModel)

      expect(result).toContain('async findAll()')
      expect(result).toContain('async findById(')
      expect(result).toContain('async create(')
      expect(result).toContain('async update(')
      expect(result).toContain('async delete(')
    })
  })

  describe('generateServiceTemplate', () => {
    it('should generate service with correct types', () => {
      const result = generateServiceTemplate(mockModel)

      expect(result).toContain('export class UserService')
      expect(result).toContain('interface CreateUserInput')
      expect(result).toContain('interface UpdateUserInput')
    })

    it('should not include id in CreateUserInput', () => {
      const result = generateServiceTemplate(mockModel)

      // Check specifically in the CreateUserInput interface
      const createInputMatch = result
        .match(/interface CreateUserInput {([\s\S]+?)}/);
      const createInputContent = createInputMatch ? createInputMatch[1] : '';

      expect(createInputContent).not.toContain('id: number')
      expect(createInputContent).toContain('email: string')
    })
  })

  describe('generateRepositoryTemplate', () => {
    it('should generate repository with prisma client', () => {
      const result = generateRepositoryTemplate(mockModel)

      expect(result).toContain('import { PrismaClient }')
      expect(result).toContain('export class UserRepository')
    })

    it('should include correct prisma methods', () => {
      const result = generateRepositoryTemplate(mockModel)

      expect(result).toContain('this.prisma.user.findMany()')
      expect(result).toContain('this.prisma.user.findUnique(')
      expect(result).toContain('this.prisma.user.create(')
      expect(result).toContain('this.prisma.user.update(')
      expect(result).toContain('this.prisma.user.delete(')
    })
  })
})