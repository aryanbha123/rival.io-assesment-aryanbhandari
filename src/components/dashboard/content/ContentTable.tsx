import { Avatar, LinearProgress } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useThemeMode } from '../../../context/ThemeContext'
import { bgGradient } from '../../../assets/colors'
import { Add } from '@mui/icons-material'
import ModalBox from './ModalBox'
import ProjectDrawer from './ProjectDrawer'

interface User {
  id: number
  name: string
  email: string
}

export interface Project {
  id: string
  title: string
  description: string
  teamMembers: User[]
  priority: 'high' | 'medium' | 'low'
  status: 'active' | 'pending' | 'completed'
  progress: number
  tasksCompleted: number
  totalTasks: number
  deadline: string
  budget: number
  createdBy: User
}

const colors = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6']

const getColorIndex = (text: string) => {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % colors.length
}

const getTeamColors = (team: User[]) => {
  let prev = -1
  return team.map(u => {
    let idx = getColorIndex(u.name)
    if (idx === prev) {
      idx = (idx + 1) % colors.length
    }
    prev = idx
    return colors[idx]
  })
}

const getColorFromId = (id: string) => {
  const index = parseInt(id.replace(/\D/g, ''), 10) % colors.length
  return colors[index]
}

const transformToProject = (post: any, allUsers: User[]): Project => {
  const teamSize = Math.floor(Math.random() * 4) + 2
  const shuffled = [...allUsers].sort(() => 0.5 - Math.random())
  const teamMembers = shuffled.slice(0, teamSize)
  const priorities: Project['priority'][] = ['high', 'medium', 'low']
  const progress = Math.floor(Math.random() * 100)
  const daysToAdd = Math.floor(Math.random() * 80) + 10
  const deadline = new Date()
  deadline.setDate(deadline.getDate() + daysToAdd)

  return {
    id: `PRJ-${String(post.id).padStart(3, '0')}`,
    title: post.title,
    description: post.body,
    teamMembers,
    priority: priorities[post.id % 3],
    status:
      progress === 100 ? 'completed' : progress > 50 ? 'active' : 'pending',
    progress,
    tasksCompleted: Math.floor(progress / 5),
    totalTasks: 20,
    deadline: deadline.toISOString().split('T')[0],
    budget: 10000 + post.id * 1000,
    createdBy: allUsers[post.userId - 1] || allUsers[0]
  }
}

const ProjectTable: React.FC = () => {
  const { mode } = useThemeMode()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchId, setSearchId] = useState('')
  const [searchPriority, setSearchPriority] = useState('')
  const [searchStatus, setSearchStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [allUsers, setAllUsers] = useState<User[]>([]) // store all users
  const projectsPerPage = 5
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    priority: 'medium',
    deadline: '',
    teamMembers: [] as number[] // store selected user IDs
  })

  const [openDrawer, setOpenDrawer] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const handleAddProject = () => {
    if (!newProject.title.trim()) return

    const id = `PRJ-${String(projects.length + 1).padStart(3, '0')}`

    // find team members by ID
    const selectedTeam = allUsers.filter(u =>
      newProject.teamMembers.includes(u.id)
    )

    const project: Project = {
      id,
      title: newProject.title,
      description: newProject.description,
      teamMembers: selectedTeam,
      priority: newProject.priority as 'high' | 'medium' | 'low',
      status: 'pending',
      progress: 0,
      tasksCompleted: 0,
      totalTasks: 20,
      deadline: newProject.deadline || new Date().toISOString().split('T')[0],
      budget: 5000,
      createdBy: { id: 1, name: 'You', email: 'you@example.com' }
    }

    setProjects([project, ...projects])
    setIsModalOpen(false)
    setNewProject({
      title: '',
      description: '',
      priority: 'medium',
      deadline: '',
      teamMembers: []
    })
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersRes, postsRes] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/users'),
          fetch('https://jsonplaceholder.typicode.com/posts')
        ])
        const users: User[] = await usersRes.json()
        setAllUsers(users) // save all users
        const posts = await postsRes.json()
        const transformedProjects = posts.map((post: any) =>
          transformToProject(post, users)
        )
        setProjects(transformedProjects)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredProjects = projects.filter(p => {
    return (
      p.id.toLowerCase().includes(searchId.toLowerCase()) &&
      (searchPriority ? p.priority === searchPriority : true) &&
      (searchStatus ? p.status === searchStatus : true)
    )
  })

  const indexOfLast = currentPage * projectsPerPage
  const indexOfFirst = indexOfLast - projectsPerPage
  const currentProjects = filteredProjects.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1)
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1)

  const pageWindowSize = 5
  const startPage =
    Math.floor((currentPage - 1) / pageWindowSize) * pageWindowSize + 1
  const endPage = Math.min(startPage + pageWindowSize - 1, totalPages)

  const tableBg = mode === 'dark' ? 'bg-[#1f1f1f]' : 'bg-white'
  const headerBg = mode === 'dark' ? 'bg-[#2a2a2a]' : 'bg-gray-50'
  const rowHover = mode === 'dark' ? 'hover:bg-[#333333]' : 'hover:bg-gray-50'
  const borderColor = mode === 'dark' ? 'border-gray-600' : 'border-gray-200'
  const textColor = mode === 'dark' ? 'text-gray-300' : 'text-gray-500'

  return (
    <section className={`py-7 ${tableBg} rounded-2xl`}>
      {loading ? (
        <div className='text-center text-gray-500'>Loading projects...</div>
      ) : (
        <>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-3 mb-7 w-full'>
            {/* Search Filters */}
            <div className='flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap w-full md:flex-1'>
              <input
                type='text'
                placeholder='Search project by ID...'
                className='placeholder:text-gray-500 border-gray-300 rounded-xl border-2 text-sm px-4 py-2 w-full sm:w-64 md:w-80 lg:w-96'
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
              />
              <select
                className='border-gray-300 rounded-xl border-2 text-sm px-4 py-2 w-full sm:w-auto'
                value={searchPriority}
                onChange={e => setSearchPriority(e.target.value)}
              >
                <option value=''>All Priorities</option>
                <option value='high'>High</option>
                <option value='medium'>Medium</option>
                <option value='low'>Low</option>
              </select>
              <select
                className='border-gray-300 rounded-xl border-2 text-sm px-4 py-2 w-full sm:w-auto'
                value={searchStatus}
                onChange={e => setSearchStatus(e.target.value)}
              >
                <option value=''>All Statuses</option>
                <option value='active'>Active</option>
                <option value='pending'>Pending</option>
                <option value='completed'>Completed</option>
              </select>
            </div>

            {/* Add Project Button */}
            <div className='flex justify-center mt-3 md:mt-0'>
              <button
                onClick={() => setIsModalOpen(true)}
                className={`${bgGradient(
                  mode
                )} px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition flex items-center text-white`}
              >
                <Add sx={{ fontSize: 20 }} className='mr-1' /> Add Project
              </button>
            </div>
          </div>

          {/* 📊 Table */}
          <div className='relative flex flex-col w-full h-full overflow-scroll text-gray-700 shadow-md rounded-xl bg-clip-border'>
            <table className='w-full text-left table-auto min-w-max'>
              <thead className={`${headerBg} uppercase`}>
                <tr>
                  {[
                    'Project',
                    'Team',
                    'Priority',
                    'Status',
                    'Progress',
                    'Deadline'
                  ].map((th, idx) => (
                    <th
                      key={idx}
                      className={`p-4 text-left text-xs font-medium ${textColor} border-b ${borderColor}`}
                    >
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentProjects.map((p, idx) => {
                  const teamColors = getTeamColors(p.teamMembers)
                  return (
                    <tr
                      onClick={() => {
                        setSelectedProject(p)
                        setOpenDrawer(true)
                      }}
                      key={idx}
                      className={`${rowHover} cursor-pointer`}
                    >
                      {/* Project */}
                      <td
                        className={`px-4 py-4 flex items-center gap-3 text-sm border-b ${borderColor}`}
                      >
                        <div
                          className='flex rounded-md p-3 text-white font-bold'
                          style={{ backgroundColor: getColorFromId(p.id) }}
                        >
                          {p.title.charAt(0).toUpperCase() +
                            p.title.charAt(1).toUpperCase()}
                        </div>
                        <div className='flex flex-col justify-center'>
                          <p className='font-semibold text-sm'>
                            {p.title.slice(0, 20)}
                          </p>
                          <p className='text-xs text-gray-400'>#{p.id}</p>
                        </div>
                      </td>

                      {/* Team */}
                      {/* Team */}
                      <td
                        className={`px-4 py-2 text-sm border-b ${borderColor}`}
                      >
                        <div className='flex -space-x-3 items-center'>
                          {p.teamMembers.slice(0, 4).map((u, i) => (
                            <Avatar
                              key={u.id}
                              sx={{
                                width: 30,
                                height: 30,
                                fontSize: '12px',
                                bgcolor: teamColors[i],
                                border: '1px solid white',
                                color: '#f1f1f1'
                              }}
                            >
                              {u.name.charAt(0).toUpperCase()}
                            </Avatar>
                          ))}
                          {p.teamMembers.length > 4 && (
                            <Avatar
                              sx={{
                                width: 30,
                                height: 30,
                                fontSize: '12px',
                                bgcolor:
                                  teamColors[
                                    Math.floor(Math.random() * (3 - 0 + 1)) + 0
                                  ],
                                border: '1px solid white',
                                color: 'white'
                              }}
                            >
                              +{p.teamMembers.length - 4}
                            </Avatar>
                          )}
                        </div>
                      </td>

                      {/* Priority */}
                      <td
                        className={`px-4 py-2 text-sm border-b ${borderColor}`}
                      >
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full 
                            ${
                              p.priority === 'high'
                                ? 'bg-red-100 text-red-600'
                                : p.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-600'
                                : 'bg-blue-100 text-blue-600'
                            }`}
                        >
                          {p.priority.toUpperCase()}
                        </span>
                      </td>

                      {/* Status */}
                      <td
                        className={`px-4 py-2 text-sm border-b ${borderColor}`}
                      >
                        <span
                          className={`flex items-center w-max gap-1 px-3 py-1 text-xs font-semibold rounded-full
                            ${
                              p.status === 'active'
                                ? 'bg-green-100 text-green-600'
                                : p.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-600'
                                : 'bg-blue-100 text-blue-600'
                            }`}
                        >
                          <span className='w-2 h-2 rounded-full bg-current'></span>
                          {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        </span>
                      </td>

                      {/* Progress */}
                      <td
                        className={`px-4 py-2 text-sm border-b ${borderColor}`}
                      >
                        <div className='flex items-center gap-2'>
                          <LinearProgress
                            variant='determinate'
                            value={p.progress}
                            sx={{
                              flexGrow: 1,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor:
                                mode === 'dark' ? '#3a3a3a' : '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                backgroundColor:
                                  p.progress === 100
                                    ? '#22c55e'
                                    : p.progress > 50
                                    ? '#facc15'
                                    : '#3b82f6'
                              }
                            }}
                          />
                          <span className='w-10 text-right text-xs font-medium'>
                            {p.progress}%
                          </span>
                        </div>
                      </td>

                      {/* Deadline */}
                      <td
                        className={`px-4 py-2 text-sm border-b ${borderColor}`}
                      >
                        <div className='flex items-center gap-1'>
                          {p.status === 'completed' ? (
                            <span className='text-green-600'></span>
                          ) : new Date(p.deadline) < new Date() ? (
                            <span className='text-yellow-500'></span>
                          ) : (
                            <span className='text-red-500'></span>
                          )}
                          <span>
                            {new Date(p.deadline).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* 📑 Pagination */}
            <div className={`flex items-center justify-between py-3 px-4`}>
              <div className='text-sm'>
                Showing {indexOfFirst + 1}-
                {Math.min(indexOfLast, filteredProjects.length)} of{' '}
                {filteredProjects.length}
              </div>
              <div className='flex justify-center gap-2 mt-4'>
                <button
                  className={`px-3 py-1 text-xs cursor-pointer rounded-md ${
                    mode === 'dark'
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-200 text-gray-700'
                  } disabled:opacity-50`}
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {Array.from(
                  { length: endPage - startPage + 1 },
                  (_, i) => startPage + i
                ).map(pageNum => (
                  <button
                    key={pageNum}
                    className={`px-3 py-1 cursor-pointer rounded-md text-sm font-medimm transition
                    ${
                      currentPage === pageNum
                        ? `text-white ${bgGradient(mode)}`
                        : mode === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  className={`px-3 py-1 text-xs cursor-pointer rounded-md ${
                    mode === 'dark'
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-200 text-gray-700'
                  } disabled:opacity-50`}
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          <ModalBox
            isModalOpen={isModalOpen}
            setNewProject={setNewProject}
            handleAddProject={handleAddProject}
            newProject={newProject}
            setIsModalOpen={setIsModalOpen}
            allUsers={allUsers}
          />
          <ProjectDrawer
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            project={selectedProject}
          />
        </>
      )}
    </section>
  )
}

export default ProjectTable
