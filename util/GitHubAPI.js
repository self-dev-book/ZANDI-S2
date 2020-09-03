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

// (여따 토큰을 가져와서 )토근 만료됐는지 확인? ;;ㅅ;;
// 1. github 토큰 만료 api 찾아보기
// 2. 없으면 테스트로 아무 요청이나 날려서 에러(bad credential..?) 뜨는지 확인하고 새로 발급받기?


