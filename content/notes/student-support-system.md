---
title: How I built a student support system at university
summary: A group project: React and MUI on the front, Node and SQL on the back, scheduled jobs for reminders, CI from the first sprint.
status: Published
publishedAt: 2022-03-26
---

This was a university group project: a web app for handling academic-dishonesty reports and related student-support workflows, built across a few sprints rather than one submission. The frontend is React with MUI and Syncfusion's date/calendar components; the backend is a Node server against a SQL database.

The part I'd call out is the reminder system. Some of the workflow has deadlines a staff member should not have to track manually, so a background worker (`bree`, running on Node worker threads) checks for due items on a schedule and sends an email through Nodemailer when one comes up, instead of relying on someone remembering to check a list.

- Login and session handling, separate from the academic-dishonesty reporting flow
- A structured report and investigation workflow, not a single freeform form
- Scheduled reminder emails for time-sensitive steps, run on worker threads

CI ran on CircleCI from early in the project, with Codecov tracking coverage on every push. Setting that up in sprint one rather than retrofitting it later meant coverage was a number we watched move, not a target we bolted on before a deadline.
