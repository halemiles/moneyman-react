// Helpers extracted from DueTillPaydayGrid for reuse
import { formatDateToMonthYear } from '../../logic/DateFormetting.js';

// Return epoch ms or NaN
export function parseTime(val) {
  if (val == null) return NaN;
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (val instanceof Date && !isNaN(val.getTime())) return val.getTime();
  if (typeof val === 'string') {
    const asDate = Date.parse(val);
    return isNaN(asDate) ? NaN : asDate;
  }
  if (typeof val === 'object') {
    if (val.date) {
      const asDate = Date.parse(val.date);
      return isNaN(asDate) ? NaN : asDate;
    }
  }
  return NaN;
}

export function normalizeName(n) {
  if (n == null) return '';
  try { return String(n).trim().toLowerCase(); } catch (e) { return '' }
}

// Parses amounts like "£1,234.56", "1,234", numbers, or numeric strings. Returns null if not parseable.
export function parseAmount(a) {
  if (a == null) return null;
  if (typeof a === 'number' && !isNaN(a)) return a;
  // Remove currency symbols, commas, spaces
  const cleaned = String(a).replace(/[^0-9.\-]/g, '');
  const num = Number(cleaned);
  return isNaN(num) ? null : num;
}

// Sum amounts for items with date >= today and <= end (if provided)
export function computeTotalDueUntil(items, end) {
  if (!Array.isArray(items) || items.length === 0) return 0;
  const endDateObj = end ? new Date(end) : null;
  const now = new Date();
  if (endDateObj) endDateObj.setHours(0,0,0,0);
  now.setHours(0,0,0,0);

  return items.reduce((acc, item) => {
    if (!item) return acc;
    const itemTime = parseTime(item.date ?? item.formattedDate ?? item);
    if (isNaN(itemTime)) return acc;
    const itemDate = new Date(itemTime);
    itemDate.setHours(0,0,0,0);
    const withinRange = (!endDateObj && itemDate >= now) || (endDateObj && itemDate >= now && itemDate <= endDateObj);
    if (!withinRange) return acc;
    const amt = parseAmount(item.amount) || 0;
    return acc + amt;
  }, 0);
}

export function computeRemainingFromPlanDates(balance, items, end) {
  const bal = Number(balance ?? 0) || 0;
  const totalDue = computeTotalDueUntil(items, end);
  return bal - totalDue;
}

// Returns object of burnPerWeek and burnPerDay (pure)
export function computeBurnRates(remainingValue, end) {
  const remaining = Number(remainingValue ?? 0) || 0;
  if (!end || isNaN(new Date(end).getTime())) {
    return { burnPerWeek: 0, burnPerDay: 0 };
  }

  const endDateObj = new Date(end);
  const msPerDay = 24 * 60 * 60 * 1000;
  const now = new Date();
  const rawDays = Math.ceil((new Date(endDateObj.setHours(0,0,0,0)) - new Date(now.setHours(0,0,0,0))) / msPerDay);
  const daysRemaining = Math.max(rawDays, 0);
  const weeksRemaining = Math.max(Math.ceil(daysRemaining / 7), 1);
  const daysForCalc = Math.max(daysRemaining, 1);

  const weekly = Math.floor(remaining / weeksRemaining);
  const daily = Math.floor(remaining / daysForCalc);

  return { burnPerWeek: weekly, burnPerDay: daily };
}

export function normalizePlanDates(items) {
  if (!Array.isArray(items)) return [];
  return items.map(item => ({ ...item, formattedDate: formatDateToMonthYear(item.date) }));
}

