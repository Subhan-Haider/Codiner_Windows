import { getGithubUser } from "../handlers/github_handlers";

export async function getGitAuthor() {
  const user = await getGithubUser();
  const author = user
    ? {
      name: `[codiner]`,
      email: user.email,
    }
    : {
      name: "[codiner]",
      email: "git@codiner.online",
    };
  return author;
}
