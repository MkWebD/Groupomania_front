export function callFetch<dataType>(url: string, options: RequestInit, cb: (data: dataType) => void): Promise<void> {
	return fetch(url, options)
		.then((res) => {
			if (!res.ok) {
				throw new Error("Fetch has failed");
			}
			return res.json() as Promise<dataType>;
		})
		.then((data) => cb(data))
		.catch((err) => console.error(err.message));
}
