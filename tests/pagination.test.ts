import {
  buildSearchHref,
  getSortColumn,
  resolvePagination,
  resolveSort,
} from "@/lib/pagination";

describe("pagination helpers", () => {
  it("resolves safe pagination defaults", () => {
    expect(resolvePagination({ page: "bad", pageSize: "999" }, 20)).toEqual({
      page: 1,
      pageSize: 20,
      from: 0,
      to: 19,
    });
  });

  it("accepts allowlisted page sizes", () => {
    expect(
      resolvePagination({ page: "3", pageSize: "50" }, 20, [20, 50]),
    ).toEqual({
      page: 3,
      pageSize: 50,
      from: 100,
      to: 149,
    });
  });

  it("resolves allowlisted sorting", () => {
    expect(
      resolveSort({ sort: "price", direction: "asc" }, ["created", "price"], {
        sort: "created",
        direction: "desc",
      }),
    ).toEqual({ sort: "price", direction: "asc" });
  });

  it("falls back for invalid sorting", () => {
    expect(
      resolveSort(
        { sort: "unsafe", direction: "sideways" },
        ["created", "price"],
        { sort: "created", direction: "desc" },
      ),
    ).toEqual({ sort: "created", direction: "desc" });
  });

  it("maps sort keys to database columns", () => {
    expect(
      getSortColumn(
        [
          { key: "created", column: "created_at" },
          { key: "price", column: "price" },
        ],
        "price",
      ),
    ).toBe("price");
  });

  it("builds hrefs while removing default page values", () => {
    expect(
      buildSearchHref(
        "/dashboard/leads",
        { status: "new", page: 3, sort: "created", direction: "desc" },
        { page: 1, sort: "score", direction: "asc" },
      ),
    ).toBe("/dashboard/leads?status=new&sort=score&direction=asc");
  });
});
