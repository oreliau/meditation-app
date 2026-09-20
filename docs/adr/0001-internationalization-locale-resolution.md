# Use shared authored translations with platform-specific locale resolution

Lumina Flow uses one shared translation catalog and Hermes-compatible FormatJS Intl polyfills for nine launch languages. Mobile resolves the Locale from the device and web exposes a persisted Web language selection in Settings; both use exact-locale, base-language, then English fallback resolution. Locale changes affect presentation and future notification content only, never Session state or persisted meditation data, and timer clocks remain fixed numeric `mm:ss`/`hh:mm:ss` displays.

## Considered Options

- Letting each platform maintain separate translation catalogs would duplicate product copy and make notifications diverge.
- Using only browser-native Intl would leave Hermes versions without the requested API surface.

## Consequences

All user-facing copy, including bundled content and local notifications, must be represented by translation keys. Locale-aware number, date, list, display-name, plural, and canonical-locale behavior is available through the same formatting boundary on mobile and web.
