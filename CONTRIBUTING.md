# Contributing to march

Contributions are what makes the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

## House rules

- Before submitting a new issue or PR, check if it already exists in [issues](https://github.com/marchhq/march/issues) or [PRs](https://github.com/marchhq/march/pulls).
  - **For Contributors**:
    - Find a github issue that sounds fun to you, comment on the issue that you want to work on on or reply to an issue that you want to work on in ⁠github-notifier channel in our discord server.

— Now wait for someone from core to remove #need approval label so that you don't end up doing something that is not validated yet or march does not need it.

  - **Our Process**:
    - We genrally respond to a PR within 14 hours.
    - We greatly value new feature ideas. To ensure consistency in the product's direction, they undergo review and approval.


## Developing

The development branch is `main`. This is the branch that all pull
requests should be made against. The changes on the `main`
branch are tagged into a release monthly.

### Setup

1. Clone the repo into a public GitHub repository

```
https://github.com/marchhq/march.git

```

2. Switch to the project folder

```
cd march
```

3. Create your feature or fix branch you plan to work on using

```
git checkout -b <feature-branch-name>
```
4. Install packages with pnpm

```
pnpm install
```

5. Set up your .env file

Go to the `app/backend` and `app/frontend` directories and duplicate the `.env.example` to `.env`.

6. Run (in development mode)

```
pnpm dev
```
## Making a Pull Request

- Be sure to [check the "Allow edits from maintainers" option](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/allowing-changes-to-a-pull-request-branch-created-from-a-fork) while creating your PR.
- If your PR refers to or fixes an issue, be sure to add `refs #XXX` or `fixes #XXX` to the PR description. Replacing `XXX` with the respective issue number. See more about [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue).
- Be sure to fill the PR Template accordingly.
- Review [App Contribution Guidelines](./packages/app-store/CONTRIBUTING.md) when building integrations.
