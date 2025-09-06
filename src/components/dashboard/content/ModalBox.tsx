import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField
} from '@mui/material'

interface User {
  id: number
  name: string
  email: string
}

interface NewProject {
  title: string
  description: string
  priority: string
  deadline: string
  teamMembers: number[] // store selected IDs
}

interface ModalProps {
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  newProject: NewProject
  setNewProject: React.Dispatch<React.SetStateAction<NewProject>>
  handleAddProject: () => void
  allUsers: User[]
}

const ModalBox: React.FC<ModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  newProject,
  setNewProject,
  handleAddProject,
  allUsers
}) => {
  return (
    <Dialog
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle>Add New Project</DialogTitle>
      <DialogContent className='flex flex-col gap-4 mt-2'>
        {/* Title */}
        <TextField
          label='Project Title'
          value={newProject.title}
          onChange={e =>
            setNewProject({ ...newProject, title: e.target.value })
          }
          fullWidth
          required
        />

        {/* Description */}
        <TextField
          label='Description'
          value={newProject.description}
          onChange={e =>
            setNewProject({ ...newProject, description: e.target.value })
          }
          fullWidth
          multiline
          rows={3}
        />

        {/* Priority */}
        <TextField
          select
          label='Priority'
          value={newProject.priority}
          onChange={e =>
            setNewProject({ ...newProject, priority: e.target.value })
          }
        >
          <MenuItem value='high'>High</MenuItem>
          <MenuItem value='medium'>Medium</MenuItem>
          <MenuItem value='low'>Low</MenuItem>
        </TextField>

        {/* Deadline */}
        <TextField
          type='date'
          label='Deadline'
          InputLabelProps={{ shrink: true }}
          value={newProject.deadline}
          onChange={e =>
            setNewProject({ ...newProject, deadline: e.target.value })
          }
        />

        {/* Team Members (multi-select) */}
        <Select
          multiple
          value={newProject.teamMembers}
          onChange={e =>
            setNewProject({
              ...newProject,
              teamMembers: (e.target.value as number[]).map(Number) 
            })
          }
        >
          {allUsers.map(u => (
            <MenuItem key={u.id} value={u.id}>
              {u.name}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
        <Button onClick={handleAddProject} variant='contained'>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModalBox
