//response object
exports.sendData = (name, data) => {
	let result = {
		message: "success",
		data: {
			[name]: data,
		},
    };
    // length of data array
	if (Array.isArray(data)) {
		result.results = data.length;
	}
	return result;
};

//response error 
exports.sendError = (message) => {
	console.log(message)
	return {
		message,
	};
};
