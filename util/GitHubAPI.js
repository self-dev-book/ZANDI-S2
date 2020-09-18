import { Octokit } from "@octokit/core";

import { GitHubLogin_ClientID, GitHubLoginMiddlewareURL_Token } from '../keys.json';
import Axios from "axios";

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

export const getUserInfo = async (token) => await request("GET /user", token);
export const getUserEvents = async (token, username) => await request(`GET /users/${username}/events`, token, {
	username: username,
	per_page:100 // 페이지 최대값
});

// export const deleteAccessToken = async (token) => await request(`DELETE /applications/${GitHubLogin_ClientID}/tokens/${token}`, token, {
// 	client_id: GitHubLogin_ClientID,
// 	access_token: token
// });

export const deleteAccessToken = (token) => {
	console.log(`deleteAccessToken(${token}), ${GitHubLoginMiddlewareURL_Token}/${token}`)
	return Axios.delete(`${GitHubLoginMiddlewareURL_Token}/${token}`)
	.then(response => {
		console.log(response.data);
		return response.data;
	})
	.catch(err => {
		console.log(err);
		// delete state_token[state];
		return null;
	});
};

// await request(`DELETE /applications/${GitHubLogin_ClientID}/tokens/${token}`, token, {
// 	client_id: GitHubLogin_ClientID,
// 	access_token: token
// });
