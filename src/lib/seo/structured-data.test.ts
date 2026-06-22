import { buildPersonSchema, buildSoftwareSchemas, buildWebsiteSchema } from './structured-data'

describe('structured data', () => {
  it('builds Person and WebSite entities', () => {
    expect(buildPersonSchema()).toMatchObject({ '@type': 'Person', name: 'Rashay Daya' })
    expect(buildWebsiteSchema()).toMatchObject({ '@type': 'WebSite', url: 'https://rashaydaya.co.za' })
  })

  it('only emits SoftwareSourceCode for projects with public repositories', () => {
    const schemas = buildSoftwareSchemas()
    expect(schemas.every((schema) => schema['@type'] === 'SoftwareSourceCode' && schema.codeRepository)).toBe(true)
  })
})
