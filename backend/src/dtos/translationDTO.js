module.exports = class TranslationDTO {
	constructor(translation) {
		this.messageId = translation.messageId;
		this.originalLanguage = translation.originalLanguage;
		this.targetLanguage = translation.targetLanguage;
		this.translatedText = translation.translatedText;
	}
};
