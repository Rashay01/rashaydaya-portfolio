---
title: How I built SwapShop, an Android item-trading app
summary: A university project: trade one item for another, with in-app chat and Firebase on the back end.
status: Published
publishedAt: 2022-09-26
---

SwapShop is an Android app for trading items: list something you have, browse what other people are offering, propose a swap instead of a sale. It's a different problem from a marketplace app, the unit of value is another item, not a price, so the matching and negotiation flow has to work without money changing hands.

Firebase handles auth, the product listings, and in-app chat between two people negotiating a swap. The accepted-swap and ongoing-swap views are separate screens backed by separate data states, since "browsing" and "tracking a swap you already agreed to" are different enough user needs that collapsing them into one list would have made both worse.

- Category-based browsing for listed items
- In-app chat tied to a specific swap proposal, not a generic inbox
- Separate ongoing-swaps and accepted-swaps views once a trade is agreed

CI ran through GitHub Actions with Codecov reporting on every push, same discipline as the student support system project from the same year. Two different group projects, two different teams, and we still went looking for CI and coverage on both without being told to.
