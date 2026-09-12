---
title: How I structure GitHub Actions for CI/CD
summary: Clear jobs, required checks, permissions, and readable failure states.
status: Published
publishedAt: 2026-06-22
relatedCaseStudy: cicd-pipeline-system
---

A pipeline should answer "why did it stop?" without anyone opening the raw log. I split workflows into named jobs (build, test, validate, deploy) rather than one long job, because GitHub renders each job as its own pass/fail line. A failing test job reads as "tests failed," not as a wall of text someone has to scroll through.

Every job gets the narrowest `permissions:` block it needs, set explicitly rather than inherited from repository defaults. A job that only runs tests gets `contents: read` and nothing else; only the deploy job gets write access to whatever it's deploying to. This is the single change that prevents a compromised or misconfigured action from doing more damage than its job requires.

Deployment is gated behind required status checks on the branch, not behind a manual "did the tests pass?" check before merging. If build or test fails, the deploy job never starts: GitHub Actions' `needs:` dependency between jobs enforces that ordering for free, so there's no manual approval step doing a computer's job.

Secrets stay in repository or environment secrets, referenced by name in the workflow YAML, never echoed into logs. For anything touching infrastructure (the Terraform validation workflow is the clearest example) I also pin third-party actions to a commit SHA rather than a tag, since a tag can move underneath you but a SHA can't.
