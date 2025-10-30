import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, TextField, InputAdornment, Box, Typography, Chip, Popper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { performSearch, clearSearch, setSearchQuery, selectSearchResults, selectSearchStatus } from '../../features/search/searchSlice';
import SearchHighlighter from '../common/SearchHighlighter';
import { debounce } from 'lodash';

const entityIcons = {
    candidate: <PersonIcon fontSize="small" />,
    client: <BusinessIcon fontSize="small" />,
    job: <WorkIcon fontSize="small" />,
};

const CustomPopper = (props) => <Popper {...props} style={{ minWidth: 400 }} placement="bottom-start" />;

const GlobalSearchBar = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const results = useAppSelector(selectSearchResults);
    const status = useAppSelector(selectSearchStatus);
    const [inputValue, setInputValue] = useState('');

    const debouncedSearch = useCallback(debounce((query) => {
        dispatch(performSearch(query));
    }, 500), []);

    useEffect(() => {
        if (inputValue) {
            debouncedSearch(inputValue);
        } else {
            dispatch(clearSearch());
        }
    }, [inputValue, debouncedSearch, dispatch]);

    const getPathForEntity = (entity) => {
        const pathMap = {
            candidate: `/candidates/${entity.id}`,
            client: `/clients/${entity.id}/edit`, // Or a detail page
            job: `/job-titles/${entity.id}/edit`,
        };
        return pathMap[entity.type] || '/dashboard';
    };

    return (
        <Autocomplete
            freeSolo
            options={results}
            loading={status === 'loading'}
            getOptionLabel={(option) => option.title || ''}
            PopperComponent={CustomPopper}
            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
            onChange={(_, value) => {
                if (value && typeof value === 'object') {
                    navigate(getPathForEntity(value));
                    dispatch(clearSearch());
                    setInputValue('');
                }
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder="Search Candidates, Companies, Jobs..."
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            )}
            renderOption={(props, option) => (
                <li {...props}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1">
                            {entityIcons[option.type]} <SearchHighlighter text={option.title} highlight={inputValue} />
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <SearchHighlighter text={option.subtitle} highlight={inputValue} />
                        </Typography>
                    </Box>
                    <Chip label={option.type} size="small" />
                </li>
            )}
        />
    );
};

export default GlobalSearchBar;