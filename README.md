# Prisma CSR Generator

A Prisma generator that automatically creates Controller-Service-Repository (CSR) pattern files for your Prisma models.

## Installation

For local development:

```bash
git clone https://github.com/rickya4a/prisma-csr-generator.git
cd prisma-csr-generator
npm install
npm run build
```

### Project Structure
```
your-workspace/
├── prisma-csr-generator/    # Your library
│   ├── src/
│   ├── dist/
│   └── package.json
│
└── your-project/           # Your project
    ├── prisma/
    │   └── schema.prisma
    └── package.json
```

### Register library as local dependency (if needed)

In prisma-csr-generator directory:
```bash
npm link
```

In your project directory:
```bash
npm link prisma-csr-generator
```

## Usage

1. Create a new project or use existing project with Prisma
2. Add the generator to your `schema.prisma`:

```typescript
generator client {
  provider = "prisma-client-js"
}

generator csr {
  provider = "node ../prisma-csr-generator"
  output   = "../"
}
```

3. Run the generator:

```bash
npx prisma generate
```

## Generated Structure

For each model in your schema, the generator creates:

```bash
src/
└── modules/
    └── [model]/
        ├── [model].controller.ts
        ├── [model].service.ts
        ├── [model].repository.ts
        └── index.ts
```

Each generated file includes:
- `[model].controller.ts`: CRUD endpoints with proper types
- `[model].service.ts`: Business logic layer
- `[model].repository.ts`: Database operations using Prisma Client
- `index.ts`: Exports all components

## Example

Given this Prisma model:

```typescript
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

The generator will create type-safe CSR files with all CRUD operations.

## Development

### Build the project

```bash
npm run build
```

### Run tests

```bash
npm test
```

### Watch mode for development

```bash
npm run dev
```

## License

MIT
