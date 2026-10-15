import { Settings } from 'luxon';

// CI runs on runners in several physical locations with no fixed timezone, so
// Luxon's system-zone date formatting (e.g. getFormattedDate) renders different
// days per runner and makes date-based tests flaky. Pin the zone so every
// environment formats dates identically.
Settings.defaultZone = 'utc';
