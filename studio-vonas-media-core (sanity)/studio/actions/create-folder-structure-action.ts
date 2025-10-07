import {DocumentActionComponent, DocumentActionProps} from 'sanity'
import {FolderIcon, PlayIcon} from '@sanity/icons'
import {useState} from 'react'

interface FolderStructureParams {
  showName?: string
  folderName?: string
  context?: 'shows' | 'tools' | 'partners' | 'company' | 'production'
  createSubfolders?: boolean
}

export const CreateFolderStructureAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const {onComplete} = props
  
  return {
    label: 'Create Folder Structure',
    icon: FolderIcon,
    dialog: {
      type: 'modal',
      header: 'Create New Folder Structure',
      content: (
        <div style={{padding: '20px'}}>
          <h3>Choose Structure Type:</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px'}}>
            
            <button
              style={{
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
              onClick={() => createShowStructure()}
            >
              <PlayIcon />
              <div>
                <div style={{fontWeight: 'bold'}}>New Show Structure</div>
                <div style={{fontSize: '14px', color: '#666'}}>Creates show with Pre-Production, Production, Post-Production, Distribution, Visual Identity folders</div>
              </div>
            </button>

            <button
              style={{
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
              onClick={() => createSimpleFolder()}
            >
              <FolderIcon />
              <div>
                <div style={{fontWeight: 'bold'}}>Simple Folder</div>
                <div style={{fontSize: '14px', color: '#666'}}>Creates a basic organizational folder</div>
              </div>
            </button>
          </div>
        </div>
      ),
    },
  }

  async function createShowStructure() {
    const showName = prompt('Enter show name:') || 'New Show'
    const showSlug = showName.toLowerCase().replace(/\\s+/g, '-')
    
    try {
      // Create main show folder
      const showDoc = await props.draft({
        _type: 'kbItem',
        kind: 'section',
        title: showName,
        docType: 'show',
        audience: 'internal',
        order: 100,
      })
      
      // Create subfolders
      const subfolders = [
        'Pre-Production',
        'Production', 
        'Post-Production',
        'Distribution',
        'Visual Identity'
      ]
      
      for (const folder of subfolders) {
        await props.draft({
          _type: 'kbItem',
          kind: 'section',
          title: `${showName} - ${folder}`,
          docType: 'folder',
          audience: 'internal',
          parent: {
            _type: 'reference',
            _ref: showDoc._id
          },
          order: subfolders.indexOf(folder) * 10,
        })
      }
      
      alert(`Created show structure for "${showName}" with all subfolders!`)
      onComplete?.()
      
    } catch (error) {
      console.error('Error creating show structure:', error)
      alert('Error creating show structure. Please try again.')
    }
  }

  async function createSimpleFolder() {
    const folderName = prompt('Enter folder name:') || 'New Folder'
    
    try {
      await props.draft({
        _type: 'kbItem',
        kind: 'section',
        title: folderName,
        docType: 'folder',
        audience: 'internal',
        order: 100,
      })
      
      alert(`Created folder "${folderName}"!`)
      onComplete?.()
      
    } catch (error) {
      console.error('Error creating folder:', error)
      alert('Error creating folder. Please try again.')
    }
  }
}
