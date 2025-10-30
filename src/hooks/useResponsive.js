import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

/**
 * A hook to get responsive booleans for different screen sizes.
 * @returns {{isMobile: boolean, isTablet: boolean, isDesktop: boolean}}
 */
const useResponsive = () => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return { isMobile, isTablet, isDesktop };
};

export default useResponsive;