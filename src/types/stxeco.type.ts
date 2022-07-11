export type IssueType = {
    htmlUrl: string|null|undefined
    createdAt: any
    title: string,
    labels: Array<string>,
    state: string,
    pullRequest: boolean,
    comments: Array<any>
}
