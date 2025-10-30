import { useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

/**
 * A hook for implementing infinite scroll.
 * @param {object} options
 * @param {boolean} options.hasNextPage - Whether there is more data to fetch.
 * @param {boolean} options.isLoading - Whether data is currently being fetched.
 * @param {function(): void} options.onLoadMore - The function to call to fetch more data.
 * @returns {import('react-intersection-observer').InViewHookResponse[0]} A ref to attach to the trigger element.
 */
const useInfiniteScroll = ({ hasNextPage, isLoading, onLoadMore }) => {
    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '0px 0px 200px 0px', // Trigger when the element is 200px from the bottom of the viewport
    });

    useEffect(() => {
        if (inView && hasNextPage && !isLoading) {
            onLoadMore();
        }
    }, [inView, hasNextPage, isLoading, onLoadMore]);

    return ref;
};

export default useInfiniteScroll;