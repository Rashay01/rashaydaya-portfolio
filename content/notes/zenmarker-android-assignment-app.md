---
title: How I built ZenMarker, an Android assignment app
summary: A university project: native Android, a PHP REST layer, and a security fix I came back for years later.
status: Published
publishedAt: 2023-01-23
---

ZenMarker started as a university assignment: an Android app where a lecturer creates assignments and students form or join groups against them. Two roles, one shared workflow, native Java on the client talking to a small PHP backend over OkHttp.

The backend wasn't a framework. It was a folder of single-purpose PHP scripts, one per operation, each one connecting to MySQL and returning a plain response the Android client could parse. That sounds crude next to the BFF patterns this site's other notes describe, and it was, but it matched the constraint: a shared university web host, no room for a Node process or a deployment pipeline, just PHP files dropped on a server.

- Lecturer creates an assignment and a course association
- Students browse open assignments and either create a group or join one
- Group membership and submissions are tracked per assignment, not per student, since marking happens at the group level

I went back to this repo in 2026, years after the original coursework, and found exactly the kind of bug a first real project tends to have: string-concatenated SQL queries built straight from request parameters, classic injection territory. I rewrote every PHP script to use prepared statements with `mysqli_prepare`, and moved the database credentials out of a committed config file into environment variables. Nothing about the app's behavior changed; the fix is invisible to a user and exactly the point.
