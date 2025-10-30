import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SortIcon from '@mui/icons-material/Sort';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import { PERMISSIONS } from '../utils/permissions';
import { USER_ROLES } from '../utils/constants';

// Defines the structure and content of the sidebar navigation
export const navConfig = [
  {
    subheader: 'General',
    items: [
      { title: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    ],
  },
  // {
  //   subheader: 'Administration',
  //   items: [
  //     { title: 'Clients', path: '/clients', icon: <BusinessIcon />, permission: PERMISSIONS.VIEW_CLIENT },
  //     { title: 'Staff', path: '/staff', icon: <AdminPanelSettingsIcon />, permission: PERMISSIONS.MANAGE_STAFF },
  //     { title: 'Projects', path: '/projects', icon: <WorkIcon />, permission: PERMISSIONS.VIEW_PROJECT },
  //     { title: 'Referrer', path: '/referrer', icon: <GroupAddIcon />, permission: PERMISSIONS.MANAGE_REFERRER },
  //   ],
  // },
  // {
  //   subheader: 'Operation',
  //   items: [
  //     { title: 'Candidates', path: '/candidates', icon: <PeopleIcon />, permission: PERMISSIONS.VIEW_CANDIDATE },
  //     { title: 'Job Titles', path: '/job-titles', icon: <WorkIcon />, permission: PERMISSIONS.VIEW_JOB },
  //     { title: 'Line Ups', path: '/line-ups', icon: <PlaylistAddCheckIcon />, permission: PERMISSIONS.MANAGE_LINEUP },
  //     { title: 'Suggestions', path: '/suggestions', icon: <LightbulbIcon />, permission: PERMISSIONS.VIEW_CANDIDATE },
  //   ],
  // },
  // {
  //     subheader: 'Management',
  //     items: [
  //       { title: 'Visitors', path: '/management/visitors', icon: <PersonIcon />, permission: PERMISSIONS.MANAGE_CANDIDATE },
  //       { title: 'Inquiries', path: '/management/inquiries', icon: <HelpOutlineIcon />, permission: PERMISSIONS.MANAGE_CANDIDATE },
  //     ]
  // },
  // {
  //     subheader: 'System',
  //     items: [
  //       { title: 'Reports', path: '/reports/labour-approval', icon: <AssessmentIcon />, permission: PERMISSIONS.VIEW_REPORTS },
  //       { title: 'Settings', path: '/settings/currencies', icon: <SettingsIcon />, permission: PERMISSIONS.MANAGE_SETTINGS },
  //     ]
  // }
];