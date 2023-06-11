export function sleep(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

export const ADMIN_TOKEN = process.env.API_ADMIN_AUTHORIZATION as string;
