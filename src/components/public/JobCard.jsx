import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Button } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import { formatDate } from '../../utils/helpers';

const JobCard = ({ job }) => {
  const { job_title, positions_required, created_at, clients } = job;
  const { company_name, country, address, lt_number } = clients;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Posted on {formatDate(created_at)}
        </Typography>
        <Typography variant="h6" component="h3" sx={{ mt: 1, mb: 1 }}>
          {job_title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
          <BusinessIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2">{company_name} (LT# {lt_number})</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
          <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2">{address}, {country}</Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
            <Chip
                icon={<GroupIcon />}
                label={`${positions_required} Positions Available`}
                variant="outlined"
                color="primary"
            />
        </Box>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button fullWidth variant="contained">View Details</Button>
      </Box>
    </Card>
  );
};

export default JobCard;