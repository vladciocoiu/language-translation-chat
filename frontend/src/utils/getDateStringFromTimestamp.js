function getDateStringFromTimestamp(timestamp) {
	const date = new Date(timestamp);
	const now = new Date();

	if (date.toDateString() === now.toDateString()) {
		// Today
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	} else if (date.getFullYear() === now.getFullYear()) {
		// This year
		return date.toLocaleString([], {
			hour: "2-digit",
			minute: "2-digit",
			day: "2-digit",
			month: "short",
		});
	} else {
		// Other years
		return date.toLocaleString([], {
			year: "numeric",
			month: "short",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
	}
}

export default getDateStringFromTimestamp;
