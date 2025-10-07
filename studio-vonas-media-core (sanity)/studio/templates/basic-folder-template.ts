export const basicFolderTpl = (schemaType: string) => {
  return {
    id: `${schemaType}-folder`,
    title: 'Create New Folder',
    schemaType,
    value: () => ({
      kind: 'section',
      title: 'New Folder',
      docType: 'folder',
      audience: 'internal',
      order: 100,
    }),
  }
}
