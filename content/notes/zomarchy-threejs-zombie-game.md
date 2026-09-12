---
title: How I built a zombie shooter with Three.js
summary: A final-year project: scene-graph level design, GLTF models, a 200,000-particle rain effect, and an honest list of what I'd change.
status: Published
publishedAt: 2022-06-09
---

ZOMARCHY is a first-person zombie shooter built on Three.js and WebGL for a final-year university project: kill every zombie in a level before the timer runs out. The level design follows a scene-graph approach, each level is a camera, lights, and a set of GLTF-loaded objects composed into one structure, rather than a flat list of meshes with no relationship to each other.

A few details took more iteration than the rest. The skybox needed to rotate, which `THREE.TextureLoader` alone didn't support, so it's built from a `BoxGeometry` with its own image path instead. The minimap uses a second, orthographic camera rendered separately and scissored to the top-right of the screen, after trying to bolt it onto the main camera produced rendering errors that weren't worth chasing further. The rain is 200,000 individual particles driven by velocity vectors, with a point light randomized for the lightning flash.

- Scene-graph level composition: camera, lighting, and GLTF objects per level
- Custom rotating skybox built from BoxGeometry, not the default texture loader path
- A second orthographic camera for the minimap, rendered and scissored separately from the main view
- 200,000-particle rain effect driven by per-particle velocity

The team's own retrospective named two things we'd do differently: split each level's classes into its own folder for cleaner separation, and let the player look up and down instead of only left and right. I still think that second one is the right call, a shooter where the camera only yaws is a constraint a tutorial accepts and a player notices immediately.
