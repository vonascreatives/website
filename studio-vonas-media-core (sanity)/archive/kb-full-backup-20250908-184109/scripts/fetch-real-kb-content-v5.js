/*
  Populate real content into kbItem pages created by the v5 seeders.
  Safe: only sets fields on existing kbItem pages by deterministic IDs.

  Run:
    npx sanity exec scripts/fetch-real-kb-content-v5.js --with-user-token
*/

const {getCliClient} = require('sanity/cli')
const apiVersion = '2024-01-01'
const client = getCliClient({apiVersion})

function slugify(input = '') {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-/&]/g, '')
    .replace(/[&]/g, 'and')
    .replace(/[\s/]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function idFromPath(pathSegments) {
  const path = pathSegments.map(slugify).filter(Boolean).join('.')
  return `kbItem.v5.${path}`
}

function blocks(text) {
  const normalized = String(text || '').replace(/\r\n/g, '\n')
  return [
    {
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [{_type: 'span', text: normalized, marks: []}],
    },
  ]
}

async function setContentByPath(path, {content, steps, section}) {
  const _id = idFromPath(path)
  const patch = client.patch(_id)
  if (content) patch.set({content: blocks(content)})
  if (Array.isArray(steps)) {
    patch.set({
      steps: steps.map((s) => ({_type: 'object', title: s.title, content: s.content || ''})),
    })
  }
  if (section) patch.set({section})
  await patch.commit({autoGenerateArrayKeys: true})
  return _id
}

async function main() {
  console.log('⏳ Populating real content into v5 KB pages...')

  // Off the Record pages
  await setContentByPath(
    ['shows', 'off-the-record', 'page', 'shooting-protocols'],
    {
      section: 'Production',
      content:
        'Shooting guidelines specific to Off the Record including equipment setup, lighting requirements, audio considerations, and interview techniques for candid conversations. Keep the lighting natural and soft, avoid heavy diffusion that changes the look guest-to-guest. Prioritize clean audio capture and consistent camera angles. Record a 30–60 second room tone and always double‑record audio.',
      steps: [
        {title: 'Equipment prep', content: 'Charge batteries, format cards, check lenses, set WB/ISO, and run a 10‑sec test record on each body.'},
        {title: 'Audio setup', content: 'Lav both host and guest. Place backup recorder. Check levels peak around −6dB.'},
        {title: 'Lighting', content: 'Key at ~45°, soft fill for the guest. Balance color temperature with practicals.'},
        {title: 'Slate & sync', content: 'Verbal slate and hand clap for easy sync in post.'},
      ],
    }
  )

  await setContentByPath(
    ['shows', 'off-the-record', 'page', 'editing-workflow'],
    {
      section: 'Post-Production',
      content:
        'Editing workflow and guidelines for Off the Record episodes: assemble in story order, maintain authentic pacing, respect sensitive topics, and keep color natural. Export review cuts with burned‑in timecode for notes. Final delivery includes full episode, captions, and platform cut‑downs as needed.',
      steps: [
        {title: 'Ingest & sync', content: 'Ingest cards to project structure. Sync via clap and room tone.'},
        {title: 'Radio edit', content: 'Build the conversation first. Remove tangents and dead air, keep the voice authentic.'},
        {title: 'Picture pass', content: 'Add b‑roll, stabilize, light grade to match cameras.'},
        {title: 'QC & delivery', content: 'Check loudness, spelling, legal, and export masters + captions.'},
      ],
    }
  )

  // Production pages
  await setContentByPath(
    ['production', 'page', 'pre-production-checklist'],
    {
      section: 'Pre-Production',
      content:
        'Pre‑production checklist for all shoots: confirm guest availability and releases, finalize schedule and logistics, lock locations and permits, prepare equipment lists, and distribute the call sheet 24 hours prior. Create a run of show and confirm backup plans.',
    }
  )

  await setContentByPath(
    ['production', 'page', 'camera-setup-guide'],
    {
      section: 'Production',
      content:
        'Camera setup guide: match frame rate and shutter across bodies, set base ISO and picture profile per show, confirm timecode and scratch audio. Always white‑balance on location and set focus peaking/ zebras for consistent exposure.',
    }
  )

  await setContentByPath(
    ['production', 'page', 'editing-and-color-guide'],
    {
      section: 'Post-Production',
      content:
        'Editing & color guide: keep skin tones natural, avoid over‑grading, and maintain continuity across angles. Use a neutral creative LUT when applicable, then balance. Loudness target for web delivery: −14 LUFS integrated with peaks under −1 dBTP.',
    }
  )

  // Company -> Vonas Media
  await setContentByPath(
    ['company', 'vonas-media', 'page', 'security-policy-overview'],
    {
      section: 'Policies',
      content:
        'Security policy overview: enforce least‑privilege access, 2‑factor authentication on all accounts, encrypted storage for source media, and weekly backups to cold storage. Access reviews happen monthly and on role change.',
    }
  )

  console.log('✅ KB pages updated with real content.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

