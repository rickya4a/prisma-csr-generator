import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper'
import { logger } from '@prisma/sdk'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import {
  generateControllerTemplate,
  generateServiceTemplate,
  generateRepositoryTemplate,
  generateIndexTemplate
} from './helpers/templateHelper'

export const onGenerate = async (options: GeneratorOptions) => {
  const outputDir = options.generator.output?.value
  if (!outputDir) {
    throw new Error('No output directory specified')
  }

  // Generate files for each model
  for (const model of options.dmmf.datamodel.models) {
    logger.info(`Generating files for ${model.name}...`)

    // Create model-specific directory in src/modules
    const modelDir = join(outputDir, 'src', 'modules', model.name.toLowerCase())
    await mkdir(modelDir, { recursive: true })

    // Generate Controller
    const controllerContent = generateControllerTemplate(model)
    await writeFile(
      join(modelDir, `${model.name.toLowerCase()}.controller.ts`),
      controllerContent
    )

    // Generate Service
    const serviceContent = generateServiceTemplate(model)
    await writeFile(
      join(modelDir, `${model.name.toLowerCase()}.service.ts`),
      serviceContent
    )

    // Generate Repository
    const repositoryContent = generateRepositoryTemplate(model)
    await writeFile(
      join(modelDir, `${model.name.toLowerCase()}.repository.ts`),
      repositoryContent
    )

    // Generate index.ts for easy imports
    const indexContent = generateIndexTemplate(model)
    await writeFile(
      join(modelDir, 'index.ts'),
      indexContent
    )
  }

  logger.info('Generation complete!')
}

generatorHandler({
  onManifest() {
    return {
      version: '1.0.0',
      defaultOutput: 'generated',
      prettyName: 'Prisma CSR Generator',
    }
  },
  onGenerate
})