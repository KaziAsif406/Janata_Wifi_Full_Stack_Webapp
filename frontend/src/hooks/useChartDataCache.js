import { useCallback } from 'react';

/**
 * useChartDataCache Hook
 * 
 * Implements in-memory caching for chart data
 * - Uses shared global cache or individual cache
 * - Stores fetched data by trade_code as key
 * - Retrieves from cache on subsequent requests for same trade_code
 * - Avoids redundant API calls when switching between charts
 * 
 * Usage:
 *   const cache = useChartDataCache(globalCache);
 *   const cachedData = cache.getFromCache(tradeCode);
 *   cache.saveToCache(tradeCode, data);
 * 
 * Returns:
 *   - getFromCache(tradeCode): Returns cached data or null
 *   - saveToCache(tradeCode, data): Saves data to cache
 *   - clearCache(): Clears entire cache
 */
export const useChartDataCache = (cacheRef) => {
  const getFromCache = useCallback((tradeCode) => {
    if (!tradeCode || !cacheRef) return null;
    return cacheRef.get(tradeCode) || null;
  }, [cacheRef]);

  const saveToCache = useCallback((tradeCode, data) => {
    if (!tradeCode || !data || !cacheRef) return;
    cacheRef.set(tradeCode, data);
  }, [cacheRef]);

  const clearCache = useCallback(() => {
    if (cacheRef) cacheRef.clear();
  }, [cacheRef]);

  return { getFromCache, saveToCache, clearCache };
};

export default useChartDataCache;

