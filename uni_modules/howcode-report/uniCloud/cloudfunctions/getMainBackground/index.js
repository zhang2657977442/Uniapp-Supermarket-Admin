'use strict';
const db = uniCloud.database()
const imagesCollection = db.collection("uni-image")
exports.main = async (event, context) => {
	const image = await imagesCollection.get()
	return image
};
