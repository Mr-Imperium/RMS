import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Box, Grid, Pagination, Skeleton } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchPublicJobs,
  selectAllPublicJobs,
  selectPublicJobsStatus,
  selectPublicJobsPagination,
  setPublicJobsCurrentPage,
} from '../../features/publicJobs/publicJobsSlice';
import JobCard from '../../components/public/JobCard';
import JobFilters from '../../components/public/JobFilters';
import { Link } from 'react-router-dom';

const JobListingsPage = () => {
  const dispatch = useAppDispatch();
  const jobs = useAppSelector(selectAllPublicJobs);
  const status = useAppSelector(selectPublicJobsStatus);
  const pagination = useAppSelector(selectPublicJobsPagination);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at.desc');

  const loadJobs = useCallback(() => {
    dispatch(fetchPublicJobs({ page: pagination.currentPage, searchQuery, sortBy }));
  }, [dispatch, pagination.currentPage, searchQuery, sortBy]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);
  
  const handlePageChange = (event, value) => {
    dispatch(setPublicJobsCurrentPage(value));
  };
  
  const handleSearch = (query) => {
    dispatch(setPublicJobsCurrentPage(1));
    setSearchQuery(query);
  };
  
  const handleSort = (sortValue) => {
    dispatch(setPublicJobsCurrentPage(1));
    setSortBy(sortValue);
  };

  const renderSkeletons = () => (
    Array.from(new Array(6)).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
      </Grid>
    ))
  );

  return (
    <>
      <Helmet>
        <title>Available Job Listings - Overseas Employment</title>
        <meta name="description" content="Browse our current open positions for overseas employment. Find your next career opportunity with us." />
      </Helmet>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Container sx={{ py: 4 }}>
          <header>
            <Typography variant="h3" component="h1" gutterBottom align="center">
              Available Job Openings
            </Typography>
            <Typography variant="h6" component="p" color="text.secondary" align="center" sx={{ mb: 4 }}>
              Find your next career opportunity abroad.
              <br/>
              Are you an employer? <Link to="/login">Log in to the dashboard</Link>.
            </Typography>
          </header>
          
          <main>
            <JobFilters onSearch={handleSearch} onSort={handleSort} sx={{ mb: 4 }} />
            
            {status === 'loading' && (
              <Grid container spacing={3}>
                {renderSkeletons()}
              </Grid>
            )}

            {status === 'succeeded' && (
              <>
                {jobs.length > 0 ? (
                  <Grid container spacing={3}>
                    {jobs.map((job) => (
                      <Grid item xs={12} sm={6} md={4} key={job.id}>
                        <JobCard job={job} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography align="center" sx={{ mt: 5 }}>
                    No job listings found. Please try adjusting your filters.
                  </Typography>
                )}
                
                {pagination.totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={pagination.totalPages}
                      page={pagination.currentPage}
                      onChange={handlePageChange}
                      color="primary"
                    />
                  </Box>
                )}
              </>
            )}

            {status === 'failed' && (
                <Typography color="error" align="center" sx={{ mt: 5 }}>
                    There was an error loading the job listings. Please try again later.
                </Typography>
            )}
          </main>
        </Container>
      </Box>
    </>
  );
};

export default JobListingsPage;