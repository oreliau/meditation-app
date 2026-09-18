# Meditation App

<p align="center">
  <strong>A calm, beautifully considered meditation timer for everyday rituals.</strong>
  <br />
  Built as a cross-platform Expo experience for iOS, Android, and the web.
</p>

<p align="center">
  <a href="https://github.com/oreliau/meditation-app"><img src="https://img.shields.io/badge/status-active%20development-e07a57?style=flat-square" alt="Active development" /></a>
  <a href="https://expo.dev/"><img src="https://img.shields.io/badge/Expo-57.0.24-000020?style=flat-square&logo=expo&logoColor=white" alt="Expo 57" /></a>
  <a href="https://reactnative.dev/"><img src="https://img.shields.io/badge/React%20Native-0.86.3-61DAFB?style=flat-square&logo=react&logoColor=20232A" alt="React Native 0.86.3" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-6.0.3-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://jestjs.io/"><img src="https://img.shields.io/badge/tests-Jest-C21325?style=flat-square&logo=jest&logoColor=white" alt="Jest tests" /></a>
</p>

<p align="center">
  <a href="#the-idea">The idea</a> ·
  <a href="#what-is-here">What is here</a> ·
  <a href="#technology">Technology</a> ·
  <a href="#run-it-locally">Run it locally</a>
</p>

## The idea

Meditation App is an exploration of what a daily meditation ritual can feel like when the interface gets out of the way. The experience is intentionally quiet: focused sessions, gentle feedback, atmospheric visuals, and enough flexibility to make a practice your own.

The project is in active development. The repository contains the working product foundation alongside visual experiments that help shape its direction.

## What is here

- **Focused sessions** — start a meditation timer with preset or custom durations.
- **A clear session arc** — follow progress in real time and receive completion feedback when the ritual ends.
- **Exploration flows** — browse meditation journeys and program detail screens.
- **Atmospheric rendering** — adaptive animated backgrounds and WebGPU experiments for a more immersive experience.
- **Sound and haptics** — audio cues and tactile feedback where they add meaning.
- **Personal preferences** — theme switching, local settings, and session-end alerts.
- **Cross-platform delivery** — one Expo Router codebase targeting iOS, Android, and static web.

## A glimpse of the direction

These are curated design explorations from the project’s visual direction. They are included as references while the product continues to evolve.

<p align="center">
  <img src="docs/stitch_lumina_flow_meditation/aura_sanctuary_explorer_web/screen.png" alt="Meditation App exploration screen showing a calm journey library" width="31%" />
  &nbsp;
  <img src="docs/stitch_lumina_flow_meditation/aura_sanctuary_timer_web/screen.png" alt="Meditation App exploration screen showing a meditation timer" width="31%" />
  &nbsp;
  <img src="docs/stitch_lumina_flow_meditation/aura_m_ditation_compl_t_e_success_3d/screen.png" alt="Meditation App exploration screen showing session completion" width="31%" />
</p>

## Technology

| Layer | Tools |
| --- | --- |
| App | Expo 57, React Native 0.86, Expo Router |
| Language | TypeScript |
| Styling | React Native Unistyles, shared theme tokens |
| Motion & feedback | Reanimated, Gesture Handler, Expo Haptics |
| Media | Expo Audio, Expo Image, Expo Notifications |
| Rendering experiments | WebGPU, TypeGPU, React Native WebGPU |
| Quality | Jest, Testing Library, Biome, TypeScript |

## Run it locally

### Prerequisites

- Node.js and pnpm
- Xcode for iOS development
- Android Studio for Android development

### Start the project

```bash
pnpm install
pnpm start
```

From the Expo CLI, choose a target or run one directly:

```bash
pnpm ios       # iOS simulator
pnpm android   # Android emulator
pnpm web       # Web
```

### Useful checks

```bash
pnpm typecheck
pnpm lint:ci
pnpm test:ci
```

## Project shape

```text
src/
├── app/          # Expo Router routes and screens
├── features/     # Timer, completion, and product behaviors
├── presentation/ # Visual systems and rendering layers
├── settings/     # Preferences and settings UI
└── theme/        # Colors, typography, spacing, and runtime theme
```

## Roadmap

- Refine the core meditation experience across native and web targets.
- Turn the strongest visual explorations into a cohesive product system.
- Expand session content, soundscapes, and repeatable daily rituals.
- Continue validating WebGPU visuals on supported platforms and devices.

## Contributing

Ideas, thoughtful issue reports, and small improvements are welcome. Before opening a pull request, please run the typecheck, linter, and test suite locally.

## License

No license has been published yet.

<p align="center">
  <sub>Made with intention by <a href="https://github.com/oreliau">oreliau</a>.</sub>
</p>
