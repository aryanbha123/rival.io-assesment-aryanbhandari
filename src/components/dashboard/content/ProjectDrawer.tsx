import {
  Drawer,
  Box,
  Typography,
  Divider,
  Avatar,
  LinearProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import {type Project } from "./ContentTable"; // ✅ import your interface

const ProjectDrawer = ({ open, onClose, project }: {
  open: boolean;
  onClose: () => void;
  project: Project | null;
}) => {
  if (!project) return null;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 380, p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{project.title}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Description */}
        <Typography variant="subtitle2" color="text.secondary">
          Description
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {project.description || "No description"}
        </Typography>

        {/* Team Members */}
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Team Members
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
          {project.teamMembers.map((u) => (
            <Avatar key={u.id} sx={{ width: 34, height: 34 }}>
              {u.name.charAt(0).toUpperCase()}
            </Avatar>
          ))}
        </Box>

        {/* Priority */}
        <Typography variant="subtitle2" color="text.secondary">
          Priority
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {project.priority.toUpperCase()}
        </Typography>

        {/* Status */}
        <Typography variant="subtitle2" color="text.secondary">
          Status
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {project.status}
        </Typography>

        {/* Deadline */}
        <Typography variant="subtitle2" color="text.secondary">
          Deadline
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {new Date(project.deadline).toLocaleDateString()}
        </Typography>

        {/* Progress */}
        <Typography variant="subtitle2" color="text.secondary">
          Progress
        </Typography>
        <LinearProgress
          variant="determinate"
          value={project.progress}
          sx={{ my: 1, borderRadius: 1 }}
        />
        <Typography variant="body2">{project.progress}%</Typography>
      </Box>
    </Drawer>
  );
};

export default ProjectDrawer;
