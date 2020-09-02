import { Octokit } from "@octokit/core";

export const getUserInfo = async (token) => {
  const octokit = new Octokit({ auth: token });
  const { data } = await octokit.request("/user");
  console.log(data);
  return data;
}