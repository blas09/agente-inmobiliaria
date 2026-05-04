export type SortDirection = "asc" | "desc";

export interface PaginationState {
  page: number;
  pageSize: number;
  from: number;
  to: number;
}

export interface SortState<TSort extends string = string> {
  sort: TSort;
  direction: SortDirection;
}

export interface PaginatedResult<TItem> {
  items: TItem[];
  total: number;
}

export interface SortOption<TSort extends string = string> {
  key: TSort;
  column: string;
}

type SearchParamValue = string | string[] | undefined;

function getFirstParam(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

export function resolvePositiveInteger(
  value: SearchParamValue,
  fallback: number,
) {
  const parsed = Number.parseInt(getFirstParam(value) ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function resolvePagination(
  params: { page?: SearchParamValue; pageSize?: SearchParamValue },
  defaultPageSize: number,
  allowedPageSizes: number[] = [defaultPageSize],
): PaginationState {
  const page = resolvePositiveInteger(params.page, 1);
  const requestedPageSize = resolvePositiveInteger(
    params.pageSize,
    defaultPageSize,
  );
  const pageSize = allowedPageSizes.includes(requestedPageSize)
    ? requestedPageSize
    : defaultPageSize;
  const from = (page - 1) * pageSize;

  return {
    page,
    pageSize,
    from,
    to: from + pageSize - 1,
  };
}

export function resolveSort<TSort extends string>(
  params: { sort?: SearchParamValue; direction?: SearchParamValue },
  allowedSorts: readonly TSort[],
  defaultSort: SortState<TSort>,
): SortState<TSort> {
  const requestedSort = getFirstParam(params.sort);
  const requestedDirection = getFirstParam(params.direction);

  return {
    sort:
      requestedSort && allowedSorts.includes(requestedSort as TSort)
        ? (requestedSort as TSort)
        : defaultSort.sort,
    direction:
      requestedDirection === "asc" || requestedDirection === "desc"
        ? requestedDirection
        : defaultSort.direction,
  };
}

export function getSortColumn<TSort extends string>(
  sortOptions: readonly SortOption<TSort>[],
  sort: TSort,
) {
  return (sortOptions.find((option) => option.key === sort) ?? sortOptions[0])
    .column;
}

export function getTotalPages(total: number, pageSize: number) {
  return Math.max(1, Math.ceil(total / pageSize));
}

export function clampPage(page: number, total: number, pageSize: number) {
  return Math.min(page, getTotalPages(total, pageSize));
}

export function buildSearchHref(
  pathname: string,
  currentParams: Record<string, string | number | undefined | null>,
  updates: Record<string, string | number | undefined | null>,
) {
  const params = new URLSearchParams();

  Object.entries(currentParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "" || value === 1) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
