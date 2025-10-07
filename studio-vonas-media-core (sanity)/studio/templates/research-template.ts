export const researchTpl = (schemaType: string) => {
  return {
    id: `${schemaType}-research`,
    title: 'Create Research Item',
    schemaType,
    value: () => ({
      tags: ['Research'],
      status: 'draft',
      itemType: 'document'
    }),
  }
}
