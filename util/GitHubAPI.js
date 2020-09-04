import { Octokit } from "@octokit/core";

export const getUserInfo = async (token) => {
  const octokit = new Octokit({ auth: token });
  const { data } = await octokit.request("/user");
  console.log(data);
  return data;
}


export const getUserActivity = async (token) => {
  const octokit = new Octokit({ auth: token });
  const { data } = await octokit.request("/events");
  console.log(data);
  return data;
}
  
export const getUserInfo = async (token) => await request("/user", token);
export const getUserActivity = async (token) => await request("/events", token);
