---
title: How I monitor websites with Grafana
summary: Turning probes and time-series data into useful uptime and SLA views.
status: Published
publishedAt: 2026-06-24
relatedCaseStudy: monitoring-dashboard
---

This is still in progress. The probe and Prometheus layer are running; Grafana dashboards and the SLA views below are what I'm building next, not what's shipped yet. Treat this as the plan I'm executing against, not a finished system.

A site returning a 200 is not the same as a site working well, so the monitoring stack starts one layer below Grafana: a probe checks each target on a schedule and Prometheus stores the result as a time series, not just a current status. Grafana only ever visualizes that history; it has no opinion about uptime, it just renders what Prometheus already recorded.

The metrics that matter for a small set of production sites are availability, response latency, and certificate expiry. Those are the three signals that catch the failure modes I've actually seen: the site is down, the site is up but slow enough to matter, or the site is about to go down because a cert lapsed. Dashboards are built around those three, not around every metric Prometheus happens to expose.

SLA-style views need a defined measurement window before they mean anything. "99.9% uptime" is meaningless without saying over what period, so each dashboard panel states its window explicitly rather than implying "always."

The whole stack runs containerized on a small Linux host, which keeps the monitoring system itself simple enough to not need its own monitoring. Dashboard access stays internal; nothing about the monitoring surface is exposed publicly, since an uptime dashboard is operational tooling, not a feature for site visitors.
