export const slugPrefixTpl = (schemaType: string, title?: string) => {
  return {
    id: `${schemaType}-with-initial-slug`,
    title: title || `Create new ${schemaType}`,
    schemaType,
    parameters: [
      {name: 'parentId', title: 'Parent ID', type: 'string'},
      {name: 'parentSlug', title: 'Parent Slug', type: 'string'},
    ],
    value: ({parentId, parentSlug}: {parentId: string; parentSlug: string}) => ({
      parent: {_type: 'reference', _ref: parentId},
      slug: {_type: 'slug', current: parentSlug ? `${parentSlug}/` : ''},
    }),
  }
}
