import {PullRequestsCreateResponse, Response} from "@octokit/rest";
import {existsSync, readFileSync} from "fs";
import {UpdateLanguageFile} from "./UpdateLanguageFile";

async function copyTranslation(sourcePath: string = "", targetPath: string = "", projectName: string = ""): Promise<Response<PullRequestsCreateResponse> | void> {
  if (!targetPath || targetPath === "") {
    console.error("TARGET_LANGUAGE_PATH path not set");
    return;
  }
  if (!sourcePath || sourcePath === "") {
    console.error("LANGUAGE_PATH path not set");
    return;
  }
  if (!existsSync(sourcePath)) {
    console.error("LANGUAGE_PATH data file not found");
    return;
  }
  if (!process.env.TRAVIS_TAG) {
    console.info("Not running on non tag build");
    return;
  }
  if (!process.env.GH_TOKEN) {
    console.error("GH_TOKEN not set");
    return;
  }
  if (!projectName || projectName === "") {
    console.error("Project Name is required");
    return;
  }
  const language = new UpdateLanguageFile("crazyfactory", "shop", process.env.GH_TOKEN);
  const content = readFileSync(sourcePath).toString();
  return await language.createFileAndPr({
    branch: `cfdemon/translation/${projectName}/${process.env.TRAVIS_TAG}`,
    content,
    message: "chore(i18n): update language files for configurator",
    filePath: targetPath,
    pullRequestBody: "",
    pullRequestTitle: `update translations to ${process.env.TRAVIS_TAG}`
  });
}

copyTranslation(process.env.LANGUAGE_PATH, process.env.TARGET_LANGUAGE_PATH, process.env.PROJECT_NAME).then((res) => {
  if (!res) {
    return;
  }
  console.info("PR created: ", res.data.html_url);
}).catch((e) => {
  console.error(e);
});
