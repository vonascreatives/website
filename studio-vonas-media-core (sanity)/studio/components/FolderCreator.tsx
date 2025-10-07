import React, {useState} from 'react'
import {Button, Dialog, Stack, TextInput, Select, Text} from '@sanity/ui'
import {FolderIcon, AddIcon} from '@sanity/icons'
import {useClient} from 'sanity'

interface FolderCreatorProps {
  onFolderCreated?: (folderId: string) => void
  context?: 'tools' | 'shows' | 'partners' | 'general'
}

export const FolderCreator = ({onFolderCreated, context = 'general'}: FolderCreatorProps) => {
  const client = useClient()
  const [open, setOpen] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [folderType, setFolderType] = useState('')
  const [loading, setLoading] = useState(false)

  const folderTypes = {
    tools: [
      {value: 'editing-design', title: 'Editing & Design'},
      {value: 'automation-data', title: 'Automation & Data'},
      {value: 'comms-ops', title: 'Comms & Ops'},
      {value: 'video-editing', title: 'Video Editing'},
      {value: 'audio-production', title: 'Audio Production'},
      {value: 'custom', title: 'Custom Category'}
    ],
    shows: [
      {value: 'interview-show', title: 'Interview Show'},
      {value: 'documentary', title: 'Documentary Series'},
      {value: 'talk-show', title: 'Talk Show'},
      {value: 'podcast', title: 'Podcast'},
      {value: 'custom', title: 'Custom Show Type'}
    ],
    partners: [
      {value: 'influencers', title: 'Influencers'},
      {value: 'brands', title: 'Brands'},
      {value: 'content-creators', title: 'Content Creators'},
      {value: 'agencies', title: 'Agencies'},
      {value: 'custom', title: 'Custom Partner Type'}
    ]
  }

  const createFolder = async () => {
    if (!folderName.trim()) return

    setLoading(true)
    
    const folderSlug = folderName.toLowerCase().replace(/\s+/g, '-')
    const parentRef = `kb.${context}.${folderSlug}`
    
    try {
      // Create folder document
      const folderDoc = {
        _type: 'kbItem',
        _id: parentRef,
        title: folderName,
        kind: 'section',
        folderType: folderType || 'custom',
        slug: {
          _type: 'slug',
          current: folderSlug
        },
        body: [
          {
            _type: 'block',
            _key: 'folder-description',
            children: [
              {
                _type: 'span',
                _key: 'folder-text',
                text: `# ${folderName}\n\nThis section contains resources and documentation for ${folderName.toLowerCase()}.\n\n## Getting Started\n- Add your documents here\n- Use consistent naming conventions\n- Tag content appropriately\n\n## Structure\nThis folder follows the standard organizational structure for ${context} content.`
              }
            ]
          }
        ],
        tags: [context, folderType, 'folder-root']
      }
      
      await client.createOrReplace(folderDoc)
      
      // If it's a show, create the standard subfolders
      if (context === 'shows') {
        const subfolders = [
          'pre-production',
          'production', 
          'post-production',
          'distribution',
          'visual-identity'
        ]
        
        for (const subfolder of subfolders) {
          const subfolderRef = `${parentRef}.${subfolder}`
          const subfolderDoc = {
            _type: 'kbItem',
            _id: subfolderRef,
            title: subfolder.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join('-'),
            kind: 'section',
            parent: {
              _type: 'reference',
              _ref: parentRef
            },
            slug: {
              _type: 'slug', 
              current: subfolder
            },
            body: [
              {
                _type: 'block',
                _key: 'subfolder-description',
                children: [
                  {
                    _type: 'span',
                    _key: 'subfolder-text',
                    text: `## ${subfolder.split('-').join(' ').toUpperCase()}\n\nDocuments and resources for the ${subfolder} phase of ${folderName}.`
                  }
                ]
              }
            ]
          }
          
          await client.createOrReplace(subfolderDoc)
        }
      }
      
      onFolderCreated?.(parentRef)
      setOpen(false)
      setFolderName('')
      setFolderType('')
      
      alert(`✅ ${context === 'shows' ? 'Show structure' : 'Folder'} "${folderName}" created successfully! Please refresh the page to see it in the navigation.`)
      
    } catch (error) {
      console.error('Error creating folder:', error)
      alert(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        icon={AddIcon}
        text={`Create New ${context === 'shows' ? 'Show' : 'Folder'}`}
        tone="primary"
        onClick={() => setOpen(true)}
      />
      
      {open && (
        <Dialog
          header={`Create New ${context === 'shows' ? 'Show Structure' : 'Folder'}`}
          id="create-folder"
          onClose={() => setOpen(false)}
          open={open}
          width={1}
        >
          <Stack space={4} padding={4}>
            <Text>
              {context === 'shows' 
                ? 'Create a new show with the complete folder structure (Pre-Production, Production, Post-Production, Distribution, Visual Identity)'
                : `Create a new folder in the ${context} section`
              }
            </Text>
            
            <TextInput
              placeholder={context === 'shows' ? 'Show name (e.g., "New Podcast")' : 'Folder name'}
              value={folderName}
              onChange={(event) => setFolderName(event.currentTarget.value)}
            />
            
            {folderTypes[context] && (
              <Select
                value={folderType}
                onChange={(event) => setFolderType(event.currentTarget.value)}
              >
                <option value="">Select type...</option>
                {folderTypes[context].map(type => (
                  <option key={type.value} value={type.value}>
                    {type.title}
                  </option>
                ))}
              </Select>
            )}
            
            <Stack direction="row" space={2}>
              <Button
                text="Cancel"
                mode="ghost"
                onClick={() => setOpen(false)}
              />
              <Button
                text={loading ? 'Creating...' : `Create ${context === 'shows' ? 'Show' : 'Folder'}`}
                tone="primary"
                loading={loading}
                disabled={!folderName.trim() || loading}
                onClick={createFolder}
              />
            </Stack>
          </Stack>
        </Dialog>
      )}
    </>
  )
}
