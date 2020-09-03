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

// 토근 만료됐는지 확인? ;;ㅅ;;


