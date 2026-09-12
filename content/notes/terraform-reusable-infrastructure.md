---
title: How I use Terraform for reusable infrastructure
summary: Separating module interfaces, environment inputs, validation, and apply.
status: Published
publishedAt: 2026-06-22
relatedCaseStudy: infrastructure-blueprint-system
---

The structure that has held up across projects is a clean split between modules and environments: modules describe a resource shape (a VPC, a service, a storage bucket) with inputs and outputs, and environment directories supply the actual values for dev, staging, or prod. The module never hardcodes an environment-specific value; if it does, it stops being reusable the first time a second environment needs something different.

Module interfaces are kept small on purpose. A module with twelve optional variables is harder to review and harder to trust than three small modules composed together. When I'm tempted to add another flag to a module, that's usually the signal that the module is trying to do two things and should split.

Every change goes through `terraform fmt -check` and `terraform validate` in GitHub Actions before a human ever runs `plan`. The plan output itself is the real review artifact: it gets posted as a CI comment so the diff between current and desired infrastructure is visible before anyone approves an apply, the same way a code diff is visible before a merge.

Apply only happens after that explicit approval, with credentials scoped to deployment secrets and never present on a local machine for production environments. The failure I'm guarding against isn't a syntax error (`validate` catches those); it's an apply that does something technically valid but operationally surprising, which only a human reading the plan will catch.
