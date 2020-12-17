const url = new URL(`${window.location.protocol}//${window.location.host}${window.location.pathname}${window.window.location.search}`);

export default {
	url: () => {
		return url;
	},

	get: (key) => {
		const fromUrl = url.searchParams.get(key);
		if (typeof fromUrl !== undefined) {
			return fromUrl;
		}

		const fromLocalStorage = localStorage.getItem(key);
		if (typeof fromLocalStorage !== undefined) {
			return fromLocalStorage
		}

		return undefined;
	},

	set: (key, value) => {
		url.searchParams.set(key, value);
		localStorage.setItem(key, value);
		window.history.replaceState({}, document.title, url.href);
	}
}
