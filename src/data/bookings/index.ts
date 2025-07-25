
// Export all booking-related functions
export { getAllBookings, getBookingsByAssetId, getBookingsByEmployeeId, getBookingById, getCurrentOrUpcomingBooking } from './fetch';
export { createBooking } from './create';
export { updateBookingStatus, updateBookingDates, updateBookingStatuses, recordAssetReturn } from './update';
export { isAssetAvailableForBooking, doDateRangesOverlap } from './availability';
export { formatDateRange, getBookingWithDetails } from './utils';
export { mapDbBookingToBooking } from './mappers';
export { 
  isBookingExpired, 
  getAvailabilityStatus, 
  countUpcomingBookings, 
  getBookingDisplayStatus, 
  getStatusLabel, 
  getStatusBadgeVariant,
  calculateBookingStats 
} from './statusUtils';
export type { RawBooking } from './types';
