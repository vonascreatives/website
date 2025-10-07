import type {StructureBuilder, DocumentStore} from 'sanity/structure'
import type {Observable} from 'rxjs'
import {distinctUntilChanged, switchMap, map} from 'rxjs/operators'
import isEqual from 'lodash/isEqual'
import {LuPlus} from 'react-icons/lu'

const apiVersion = '2023-01-01'

export function parentChild(schemaType: string, S: any, documentStore: DocumentStore) {
  const filterWithoutParent = `_type == "${schemaType}" && !defined(parent) && !(_id in path("drafts.**"))`
  const filterAll = `_type == "${schemaType}" && !(_id in path("drafts.**"))`
  const query = `*[${filterWithoutParent}]{ _id, title, slug }`
  const queryId = (id: string) =>
    `*[${filterAll} && _id == "${id}"][0]{ _id, title, slug, parent, children }`
  const queryGetChildren = (id: string, schemaType: string) =>
    `*[_type == "${schemaType}" && (_id == "${id}" || parent._ref == "${id}") && !(_id in path("drafts.**"))]{ _id, title, slug, parent, children }`

  const options = {apiVersion}

  const getChildrenFn = (id: string, S: any, fn: any): any => {
    return documentStore
      // @ts-ignore
      .listenQuery(queryGetChildren(id, schemaType), {}, options)
      .pipe(
        distinctUntilChanged(isEqual as any),
        switchMap((children: any) => {
          // @ts-ignore
          return documentStore.listenQuery(queryId(id), {}, options).pipe(
            distinctUntilChanged(isEqual as any),
            map((parent: any) => {
              return S.list()
                .menuItems([
                  parent &&
                    S.menuItem()
                      .title('Create new item')
                      .icon(LuPlus)
                      .intent({
                        type: 'create',
                        params: [
                          {type: schemaType, template: `${schemaType}-with-initial-slug`},
                          {parentId: parent?._id, parentSlug: parent?.slug?.current},
                        ],
                      }),
                ])
                .title(parent?.title || '…')
                .items([
                  parent?._id === id &&
                    S.listItem()
                      .id(parent._id)
                      .title(parent.title)
                      .child(
                        S.document()
                          .documentId(parent._id)
                          .schemaType(schemaType)
                      ),

                  S.divider(),

                  ...children
                    .filter(({_id}: {_id: string}) => id !== _id)
                    .map((child: any) =>
                      S.listItem()
                        .id(child._id)
                        .title(child.title)
                        .schemaType(schemaType)
                        .child((_id: string) => fn(_id, S, fn))
                    ),
                ])
            })
          )
        })
      )
  }

  return S.listItem()
    .title('Pages')
    .child(() =>
      // @ts-ignore
      documentStore.listenQuery(query, {}, options).pipe(
        distinctUntilChanged(isEqual as any),
        map((parents: any[]) =>
          S.list()
            .title('Pages')
            .menuItems([
              S.menuItem()
                .title('Add')
                .icon(LuPlus)
                .intent({type: 'create', params: {type: schemaType}}),
            ])
            .items([
              S.listItem()
                .title('All')
                .schemaType(schemaType)
                .child(() =>
                  S.documentList()
                    .schemaType(schemaType)
                    .title('All')
                    .apiVersion(apiVersion as any)
                    .filter(filterAll)
                    .canHandleIntent((intentName: string, params: any) => intentName === 'edit' && params.type === schemaType)
                    .child((id: string) => S.document().documentId(id).schemaType(schemaType))
                ),
              S.divider(),
              ...parents.map((parent: any) =>
                S.listItem().id(parent._id).title(parent.title).schemaType(schemaType).child((id: string) => getChildrenFn(id, S, getChildrenFn))
              ),
            ])
        )
      )
    )
}
