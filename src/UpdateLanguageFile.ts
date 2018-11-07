import Api from "@octokit/rest"; // tslint:disable-line

interface IUpdateFileOptions {
  content: string;
  branch: string;
  message: string;
  pullRequestTitle: string;
  pullRequestBody: string;
  filePath: string;
}

interface IFileInfo {
  content: string;
  sha: string;
}

export class UpdateLanguageFile {
  private github: Api;

  constructor(private owner: string, private repo: string, token: string) {
    this.github = new Api({headers: {"User-Agent": "cyberhck"}});
    this.github.authenticate({
      type: "oauth",
      token
    });
  }

  public async createFileAndPr(newContent: IUpdateFileOptions): Promise<Api.Response<Api.PullRequestsCreateResponse>> {
    console.info("getting content from file");
    const content = await this.getContentFromFile(newContent.filePath);
    console.info("creating a new branch: ", newContent.branch);
    const branch = await this.createBranch(newContent.branch);
    console.info("pushing new file...");
    await this.github.repos.updateFile({
      content: Buffer.from(newContent.content).toString("base64"),
      branch,
      message: newContent.message,
      owner: this.owner,
      repo: this.repo,
      path: newContent.filePath,
      sha: content.sha
    });
    console.info("creating new pull request");
    return await this.createPullRequest(newContent.pullRequestTitle, newContent.pullRequestBody, branch.replace("refs/heads/", ""));
  }

  private async createPullRequest(title: string, body: string, branch: string): Promise<Api.Response<Api.PullRequestsCreateResponse>> {
    console.info(title, body, branch, `${this.repo}:${branch}`);
    return await this.github.pullRequests.create({
      owner: this.owner,
      repo: this.repo,
      title,
      body,
      base: "master",
      head: `${branch}`
    });
  }

  private async createBranch(name: string): Promise<string> {
    const sha = await this.getShaForMaster();
    try {
      const data = await this.github.gitdata.createReference({
        owner: this.owner,
        repo: this.repo,
        ref: `refs/heads/${name}`,
        sha
      });
      return data.data.ref;
    } catch (e) {
      const error = JSON.parse(e.message);
      if (error.message === "Reference already exists") {
        console.info("reference already exists, using same reference");
        return `refs/heads/${name}`;
      }
      throw e;
    }
  }

  private async getShaForMaster(): Promise<string> {
    const ref = await this.github.gitdata.getReference({owner: this.owner, repo: this.repo, ref: "heads/master"});
    return ref.data.object.sha;
  }

  private async getContentFromFile(file: string): Promise<IFileInfo> {
    const data = await this.github.repos.getContent({owner: this.owner, path: file, repo: this.repo});
    return {
      content: data.data.content,
      sha: data.data.sha
    };
  }
}
