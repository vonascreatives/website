import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getJobTests, getJobTestBySlug, JobTest } from '@/lib/sanity-queries'
import { JobTestDetailsMain } from '@/_pages/jobs/job-test-details'

interface JobTestPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const jobTests = await getJobTests()
  return jobTests.map((jobTest) => ({
    slug: jobTest.slug.current,
  }))
}

export async function generateMetadata({ params }: JobTestPageProps): Promise<Metadata> {
  const { slug } = await params
  const jobTest = await getJobTestBySlug(slug)
  
  if (!jobTest) {
    return {
      title: 'Job Test Not Found',
      description: 'The requested job test could not be found.'
    }
  }

  const description = Array.isArray(jobTest.content) 
    ? jobTest.content
        .filter(block => block._type === 'block')
        .map(block => block.children?.map((child: any) => child.text).join(' '))
        .join(' ')
        .slice(0, 160)
    : 'Job test details and requirements'

  return {
    title: `${jobTest.title} | Job Test | Vonas Media`,
    description,
    openGraph: {
      title: jobTest.title,
      description,
      type: 'article',
      url: `/job-tests/${slug}`,
    },
    twitter: {
      card: 'summary',
      title: jobTest.title,
      description,
    },
  }
}

export default async function JobTestPage({ params }: JobTestPageProps) {
  const { slug } = await params
  const jobTest = await getJobTestBySlug(slug)
  
  if (!jobTest) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: jobTest.title,
    description: Array.isArray(jobTest.content) 
      ? jobTest.content
          .filter(block => block._type === 'block')
          .map(block => block.children?.map((child: any) => child.text).join(' '))
          .join(' ')
          .slice(0, 160)
      : 'Job test details and requirements',
    author: jobTest.contactPerson ? {
      '@type': 'Person',
      name: jobTest.contactPerson.name,
      email: jobTest.contactPerson.email
    } : {
      '@type': 'Organization',
      name: 'Vonas Media'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vonas Media'
    },
    url: `/job-tests/${slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JobTestDetailsMain jobTest={jobTest} />
    </>
  )
}