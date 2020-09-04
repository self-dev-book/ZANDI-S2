import { Octokit } from "@octokit/core";



export const getUserInfo = async () => {
  const octokit = new Octokit({ auth: {GitHubToken} });
  const { data } = await octokit.request("/user");
  console.log(data);
  return data;
}