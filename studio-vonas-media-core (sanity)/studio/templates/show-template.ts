export const showTemplate = (schemaType: string) => {
  return {
    id: `${schemaType}-show`,
    title: 'Create New Show',
    schemaType,
    value: () => ({
      kind: 'section',
      title: 'New Show',
      docType: 'show',
      audience: 'internal',
      tags: ['Show'],
      order: 100,
      summary: 'Main show folder - create subfolders for Pre-Production, Production, Post-Production, Distribution, and Visual Identity inside this folder.',
    }),
  }
}
