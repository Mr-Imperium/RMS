import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from '../../components/dashboard/StatCard';
import BusinessIcon from '@mui/icons-material/Business';

describe('StatCard Component', () => {
  it('renders the title, value, and icon correctly', () => {
    render(<StatCard title="Total Clients" value={123} icon={<BusinessIcon data-testid="icon" />} />);

    expect(screen.getByText('Total Clients')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});