import { DMMF } from "@prisma/generator-helper";

function getTypeForField(field: DMMF.Field): string {
  if (field.type === "Int") return "number";
  if (field.type === "String") return "string";
  if (field.type === "Boolean") return "boolean";
  if (field.type === "DateTime") return "Date";
  if (field.type === "Float") return "number";
  return "any";
}

function generateCreateInputType(model: DMMF.Model): string {
  const fields = model.fields
    .filter((field) => !field.isId && !field.isUpdatedAt)
    .map((field) => {
      const optional = !field.isRequired || field.hasDefaultValue;
      return `  ${field.name}${optional ? "?" : ""}: ${getTypeForField(
        field
      )};`;
    })
    .join("\n");

  return `interface Create${model.name}Input {\n${fields}\n}`;
}

function generateUpdateInputType(model: DMMF.Model): string {
  const fields = model.fields
    .filter((field) => !field.isId && !field.isUpdatedAt)
    .map((field) => `  ${field.name}?: ${getTypeForField(field)};`)
    .join("\n");

  return `interface Update${model.name}Input {\n${fields}\n}`;
}

export function generateControllerTemplate(model: DMMF.Model) {
  const idType = getTypeForField(model.fields.find((f) => f.isId)!);
  const createType = `Create${model.name}Input`;
  const updateType = `Update${model.name}Input`;

  return `import { ${
    model.name
  }Service } from './${model.name.toLowerCase()}.service';

${generateCreateInputType(model)}

${generateUpdateInputType(model)}

export class ${model.name}Controller {
  constructor(private readonly ${model.name.toLowerCase()}Service: ${
    model.name
  }Service) {}

  async findAll() {
    return this.${model.name.toLowerCase()}Service.findAll();
  }

  async findById(id: ${idType}) {
    return this.${model.name.toLowerCase()}Service.findById(id);
  }

  async create(data: ${createType}) {
    return this.${model.name.toLowerCase()}Service.create(data);
  }

  async update(id: ${idType}, data: ${updateType}) {
    return this.${model.name.toLowerCase()}Service.update(id, data);
  }

  async delete(id: ${idType}) {
    return this.${model.name.toLowerCase()}Service.delete(id);
  }
}`;
}

export function generateServiceTemplate(model: DMMF.Model) {
  const idType = getTypeForField(model.fields.find((f) => f.isId)!);
  const createType = `Create${model.name}Input`;
  const updateType = `Update${model.name}Input`;

  return `import { ${
    model.name
  }Repository } from './${model.name.toLowerCase()}.repository';

${generateCreateInputType(model)}

${generateUpdateInputType(model)}

export class ${model.name}Service {
  constructor(private readonly ${model.name.toLowerCase()}Repository: ${
    model.name
  }Repository) {}

  async findAll() {
    return this.${model.name.toLowerCase()}Repository.findAll();
  }

  async findById(id: ${idType}) {
    return this.${model.name.toLowerCase()}Repository.findById(id);
  }

  async create(data: ${createType}) {
    return this.${model.name.toLowerCase()}Repository.create(data);
  }

  async update(id: ${idType}, data: ${updateType}) {
    return this.${model.name.toLowerCase()}Repository.update(id, data);
  }

  async delete(id: ${idType}) {
    return this.${model.name.toLowerCase()}Repository.delete(id);
  }
}`;
}

export function generateRepositoryTemplate(model: DMMF.Model) {
  const idType = getTypeForField(model.fields.find((f) => f.isId)!);
  const createType = `Create${model.name}Input`;
  const updateType = `Update${model.name}Input`;

  return `import { PrismaClient } from '@prisma/client';

${generateCreateInputType(model)}

${generateUpdateInputType(model)}

export class ${model.name}Repository {
  constructor(private prisma: PrismaClient) {}

  async findAll() {
    return this.prisma.${model.name.toLowerCase()}.findMany();
  }

  async findById(id: ${idType}) {
    return this.prisma.${model.name.toLowerCase()}.findUnique({
      where: { id },
    });
  }

  async create(data: ${createType}) {
    return this.prisma.${model.name.toLowerCase()}.create({
      data,
    });
  }

  async update(id: ${idType}, data: ${updateType}) {
    return this.prisma.${model.name.toLowerCase()}.update({
      where: { id },
      data,
    });
  }

  async delete(id: ${idType}) {
    return this.prisma.${model.name.toLowerCase()}.delete({
      where: { id },
    });
  }
}`;
}

export function generateIndexTemplate(model: DMMF.Model) {
  return `export * from './${model.name.toLowerCase()}.controller';
export * from './${model.name.toLowerCase()}.service';
export * from './${model.name.toLowerCase()}.repository';
`;
}
