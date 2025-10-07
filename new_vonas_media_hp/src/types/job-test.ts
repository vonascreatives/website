export interface JobTest {
  _id: string
  title: string
  slug: { current: string }
  content: any[]
  contactPerson?: {
    _id: string
    name: string
    email?: string
    image?: string
  }
  supportedDocuments?: any[]
  relatedFAQs?: any[]
  order: number
  isActive: boolean
}