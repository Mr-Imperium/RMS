import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Box, Typography, Avatar, Button, Grid, Divider, Chip, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { format } from 'date-fns';

const DetectionResultCard = ({ result }) => {
  const navigate = useNavigate();
  const { candidate_id, given_name, family_name, passport_no, mobile_number, email, lineup_history } = result;

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main' }}>
              <PersonIcon sx={{ fontSize: 50 }} />
            </Avatar>
            <Typography variant="h5">{`${given_name} ${family_name || ''}`}</Typography>
            <Typography variant="body1" color="text.secondary">Passport #: {passport_no}</Typography>
            <Typography variant="body2" color="text.secondary">{email}</Typography>
            <Typography variant="body2" color="text.secondary">{mobile_number}</Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => navigate(`/candidates/${candidate_id}`)}
            >
              View Full Profile
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>Employment History & Lineups</Typography>
          <Divider sx={{ mb: 2 }} />
          {lineup_history && lineup_history.length > 0 ? (
            <List dense>
              {lineup_history.map((item) => (
                <ListItem key={item.lineup_id} divider>
                  <ListItemIcon>
                    {item.departure_status ? <FlightTakeoffIcon color="success" /> : <WorkIcon color="action" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={`${item.job_title} at ${item.company_name} (LT# ${item.lt_number})`}
                    secondary={`Applied on: ${format(new Date(item.lineup_created_at), 'MMM d, yyyy')}`}
                  />
                  <Chip label={item.status} size="small" color={item.status === 'Departed' ? 'success' : 'default'} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">No employment history or active lineups found for this candidate.</Typography>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DetectionResultCard;