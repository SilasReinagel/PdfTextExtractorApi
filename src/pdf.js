// @ts-check
const Ocr = require('node-ts-ocr').Ocr;

const getPdfText = async (fileName) => {
	return await Ocr.extractText(fileName);
}

module.exports = { getPdfText };
