import { Query } from "mongoose";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, any>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, any>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      } as any);
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    ["searchTerm", "sort", "page", "limit", "fields"].forEach((k) => delete queryObj[k]);
    this.modelQuery = this.modelQuery.find(queryObj as any);
    return this;
  }

  sort() {
    const sortBy = (this.query.sort as string)?.split(",").join(" ") || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sortBy);
    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  async countTotal() {
    const filterQuery = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(filterQuery);
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    return { total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}