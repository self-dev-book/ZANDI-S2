import { Octokit } from "@octokit/core";

import { GitHubLogin_ClientID } from '../keys.json';

// request to GitHub using Octokit
const request = async (route, token, options = {}) => {
	const octokit = new Octokit({ auth: token });
	octokit.hook.error("request", async (error, options) => {
		console.log(`Error occured on request with status ${error.status}`);
		if (error.status == 401) {
			// Bad Credential
			throw "Bad Credential";
		} else {
			throw "Unexpected Error";
		}
	});

	// error throwable
	console.log(`request to ${route}`);
	const { data } = await octokit.request(route, options);
	return data;
}

export const getUserInfo = async (token) => await request("/user", token);
export const getUserActivity = async (token) => await request("/events", token);
export const deleteAccessToken = async (token) => await request(`DELETE /applications/{client_id}/token`, token, {
	client_id: GitHubLogin_ClientID,
	access_token: token
});
