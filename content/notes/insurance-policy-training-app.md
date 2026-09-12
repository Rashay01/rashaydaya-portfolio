---
title: How I built an insurance policy app on a Python training course
summary: A Flask CRUD app from a structured training program: policies, customers, and claims with real status workflows.
status: Published
publishedAt: 2024-03-24
---

This was a training-course project, not freelance or client work: a structured program used a fictional insurance product as the brief, and the deliverable was a working policy management system in Flask. The stack was Flask, Flask-Login, Flask-WTF, and Flask-SQLAlchemy against an Azure-hosted database, with Jinja2 templates and Bootstrap for the UI.

The interesting constraint wasn't the CRUD itself, it was the status modeling. A policy doesn't get deleted when a customer cancels it; it changes status, because the brief called for keeping full transaction history rather than losing records. A claim moves through a fixed set of states (received, under investigation, declined, approved) instead of a free-text status field, so an invalid transition is a validation error, not a typo that ships.

- User registration and authentication with Flask-Login
- Policy CRUD with status-based soft deletes, not hard deletes
- Customer records that can be updated but never deleted, for the same audit-trail reason
- Claims that move through a fixed status workflow instead of an open string field

I documented the REST endpoints in a Postman collection as part of the course deliverable, the same habit I now apply to every API I build, training course or not: if the API isn't documented somewhere a reviewer can open without reading the source, it isn't really done.
