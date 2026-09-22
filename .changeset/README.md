# Changesets

Every pull request that changes what users get adds a changeset:

```sh
npx changeset          # pick patch / minor / major, write one line for the changelog
```

It is a small markdown file in this folder, committed with the change. On `main` the Release workflow
collects them into a **Version Packages** pull request (versions bumped, CHANGELOG written). Merging that
pull request publishes both packages to npmjs and GitHub Packages and tags the release — no manual tag.

`@jirawatpyk/aura-tokens` and `@jirawatpyk/aura-react` are released together at the same version.

- patch — a fix; nothing to change in projects
- minor — something new (component, prop, token); nothing to change in projects
- major — projects must change something (renamed prop, removed token); say what in the changeset
