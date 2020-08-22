class ApiFeatures {
	constructor(monogoQuery, reqQuery) {
		this.monogoQuery = monogoQuery;
		this.reqQuery = reqQuery;
	}

	// filter query
	filter = () => {
		const query = { ...this.reqQuery };
		// don't include this fields in query
		const excludesFields = ["page", "sort", "limit", "fields", "page"];
		excludesFields.forEach((el) => delete query[el]);
		let queryFields = JSON.stringify(query);
		queryFields = queryFields.replace(
			/\b(gt|gte|lt|lte)\b/g,
			(match) => `$${match}`
		);
		queryFields = JSON.parse(queryFields);

		this.monogoQuery.find(queryFields);
		return this;
	};

	sort = () => {
		//if sorting is required
		if (this.reqQuery.sort) {
			const sortFields = this.reqQuery.sort.split(",").join(" ");
			this.monogoQuery = this.monogoQuery.sort(sortFields);
		}
		return this;
	};

	fields = () => {
		// projection
		if (this.reqQuery.fields) {
			const fields = this.reqQuery.fields.split(",").join(" ");
			this.monogoQuery = this.monogoQuery.select(fields);
		} 
		return this;
	};

	pagination = () => {
		//pagination
		const page = Number(this.reqQuery.page) || 1;
		const limit = Number(this.reqQuery.limit) || 15;
		const offset = limit * (page - 1);
		this.monogoQuery = this.monogoQuery.skip(offset).limit(limit);
		return this;
	};
}


module.exports = ApiFeatures