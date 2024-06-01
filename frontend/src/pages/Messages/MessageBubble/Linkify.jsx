const Linkify = ({ text }) => {
	const urlPattern =
		/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])|(\bwww\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*)|(\b[-A-Z0-9+&@#\/%?=~_|]+\.[A-Z]{2,}(?:\.[A-Z]{2,})*)/gi;
	const whitespacePattern = /(\s+)/;

	const parts = text.split(whitespacePattern).map((part, index) => {
		if (urlPattern.test(part)) {
			const href = part.startsWith("http") ? part : `http://${part}`;
			return (
				<a key={index} href={href} target="_blank">
					{part}
				</a>
			);
		}
		return part;
	});

	return <span>{parts}</span>;
};

export default Linkify;
