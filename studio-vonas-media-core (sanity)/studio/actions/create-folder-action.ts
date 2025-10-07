import {defineAction} from 'sanity'
import {FolderIcon} from '@sanity/icons'

export const createFolderAction = defineAction({
  name: 'createFolder',
  title: 'Create Folder Structure',
  icon: FolderIcon,
  action: (context) => {
    const {client, schema} = context
    
    return {
      label: 'Create Folder Structure',
      onHandle: async () => {
        // Get the folder name from user
        const folderName = prompt('Enter folder name (e.g., "New Tool Category"):')
        
        if (!folderName) return
        
        const folderSlug = folderName.toLowerCase().replace(/\s+/g, '-')
        
        // Determine the parent based on current context
        const currentPath = window.location.pathname
        let parentRef = ''
        let folderType = 'general'
        
        if (currentPath.includes('/tools/')) {
          parentRef = `kb.tools.${folderSlug}`
          folderType = 'tool-category'
        } else if (currentPath.includes('/shows/')) {
          parentRef = `kb.shows.${folderSlug}`
          folderType = 'show'
        } else if (currentPath.includes('/partners/')) {
          parentRef = `kb.partners.${folderSlug}`
          folderType = 'partner-category'
        } else {
          parentRef = `kb.${folderSlug}`
        }
        
        try {
          // Create a folder document that acts as a parent reference
          const folderDoc = {
            _type: 'kbItem',
            _id: parentRef,
            title: folderName,
            kind: 'section',
            folderType: folderType,
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
                    text: `This is the ${folderName} section. Add documents here to organize your content.`
                  }
                ]
              }
            ]
          }
          
          await client.createOrReplace(folderDoc)
          
          // Show success message
          alert(`✅ Folder "${folderName}" created successfully! Refresh the page to see it in the structure.`)
          
          // Refresh the page to update the structure
          window.location.reload()
          
        } catch (error) {
          console.error('Error creating folder:', error)
          alert(`❌ Error creating folder: ${error}`)
        }
      }
    }
  }
})
