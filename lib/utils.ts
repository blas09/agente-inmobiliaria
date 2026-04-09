import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatCurrency(
	value: number | null | undefined,
	currency = "PYG",
	locale = "es-PY",
) {
	if (value == null) return "Sin definir";

	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
		maximumFractionDigits: currency === "PYG" ? 0 : 2,
	}).format(value);
}

export function formatCompactNumber(value: number) {
	return new Intl.NumberFormat("en", {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(value);
}

export function formatDateTime(value: string | Date | null | undefined, locale = "es-PY") {
	if (!value) return "Sin fecha";

	return new Intl.DateTimeFormat(locale, {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(new Date(value));
}

function getTimeZoneDateParts(date: Date, timeZone: string) {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	}).formatToParts(date);

	const partMap = Object.fromEntries(parts.map((part) => [part.type, part.value]));

	return {
		year: Number(partMap.year),
		month: Number(partMap.month),
		day: Number(partMap.day),
		hour: Number(partMap.hour),
		minute: Number(partMap.minute),
		second: Number(partMap.second),
	};
}

function getTimeZoneOffsetMilliseconds(date: Date, timeZone: string) {
	const parts = getTimeZoneDateParts(date, timeZone);
	const asUtc = Date.UTC(
		parts.year,
		parts.month - 1,
		parts.day,
		parts.hour,
		parts.minute,
		parts.second,
	);

	return asUtc - date.getTime();
}

export function zonedDateTimeLocalToUtcIso(value: string, timeZone: string) {
	const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
	if (!match) return null;

	const [, year, month, day, hour, minute] = match;
	const utcGuess = new Date(
		Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), 0),
	);
	const firstOffset = getTimeZoneOffsetMilliseconds(utcGuess, timeZone);
	const firstPass = new Date(utcGuess.getTime() - firstOffset);
	const finalOffset = getTimeZoneOffsetMilliseconds(firstPass, timeZone);

	return new Date(utcGuess.getTime() - finalOffset).toISOString();
}

export function formatDateTimeLocalInput(value: string | Date | null | undefined, timeZone: string) {
	if (!value) return "";

	const parts = getTimeZoneDateParts(new Date(value), timeZone);
	const pad = (segment: number) => segment.toString().padStart(2, "0");

	return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}`;
}

export function toNullableNumber(value: FormDataEntryValue | null) {
	if (value == null || value === "") return null;

	const parsed = Number(value);
	return Number.isNaN(parsed) ? null : parsed;
}

export function toNullableInteger(value: FormDataEntryValue | null) {
	const parsed = toNullableNumber(value);
	return parsed == null ? null : Math.trunc(parsed);
}

export function toNullableString(value: FormDataEntryValue | null) {
	if (value == null) return null;
	const trimmed = value.toString().trim();
	return trimmed.length === 0 ? null : trimmed;
}

export function toBoolean(value: FormDataEntryValue | null) {
	return value === "on" || value === "true";
}
