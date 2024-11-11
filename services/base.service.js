class BaseService {
	constructor(model) {
		this.model = model;
	}

	async create(data) {
		return await this.model.create({ data });
	}

	async update(id, data) {
		return await this.model.update({
			where: { id: id },
			data: data,
		});
	}

	async delete(id) {
		return await this.model.delete({
			where: { id: id },
		});
	}

	async findAll(options = {}) {
		return await this.model.findMany(options);
	}

	async findById(id) {
		return await this.model.findUnique({
			where: { id: id },
		});
	}

	async findByUnique(where) {
		return await this.model.findUnique({
			where: where,
		});
	}
}

module.exports = BaseService;
