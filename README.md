# Trading Journal Mobile App

A modern mobile trading journal built with **React Native + Expo + TypeScript**.

The application is designed around a simple goal:

> Make it extremely easy for a trader to record, review, and understand their trades.

---

## Current Development Phase

This project is currently a **UI-first prototype**.

### IMPORTANT

There is currently:

- NO backend
- NO database
- NO authentication logic
- NO API
- NO SQLite
- NO AsyncStorage
- NO cloud storage
- NO broker integration
- NO Deriv integration
- NO MT5 integration

The application must use **dummy/static data** for the current development phase.

Do not introduce a backend or local database unless explicitly instructed.

---

# 1. Technology Stack

## Core

- React Native
- Expo
- TypeScript
- Expo Router

## Styling

- NativeWind
- Tailwind CSS

## Responsive Layout

- react-native-responsive-screen

Use:

```ts
widthPercentageToDP;
heightPercentageToDP;
```

only where responsive dimensions are actually needed.

NativeWind should remain the primary styling solution.

Do not introduce another styling framework.

---

## State Management

- Zustand

Zustand is currently only for client/UI state.

Do not use Zustand as a replacement for a database.

Do not build persistence into Zustand during the UI prototype phase.

---

## Forms

- React Hook Form
- Zod
- @hookform/resolvers

Forms should already be structured correctly so they can later connect to the API.

---

## Icons

- @expo/vector-icons

Prefer Ionicons unless a different icon is clearly more appropriate.

---

## Charts

- react-native-svg
- react-native-chart-kit

Charts should remain simple during the prototype phase.

---

## Utilities

- date-fns

---

## Images

- expo-image-picker

Use this when implementing the screenshot UI.

Image uploading is NOT required yet.

---

# 2. Installation

Expected packages:

```bash
npx create-expo-app@latest trading-journal
```

Core dependencies:

```bash
npx expo install expo-router
npx expo install react-native-safe-area-context
npx expo install react-native-screens
npx expo install react-native-gesture-handler
npx expo install @expo/vector-icons
npx expo install react-native-svg
```

Styling:

```bash
npm install nativewind
npm install --save-dev tailwindcss
```

Responsive:

```bash
npm install react-native-responsive-screen
```

State:

```bash
npm install zustand
```

Forms:

```bash
npm install react-hook-form zod @hookform/resolvers
```

Charts:

```bash
npm install react-native-chart-kit
```

Utilities:

```bash
npm install date-fns
```

Images:

```bash
npx expo install expo-image-picker
```

Only add additional packages when there is a clear requirement.

---

# 3. Product Structure

The application contains five primary areas:

```text
Dashboard
Trades
Analytics
Calendar
Settings
```

Secondary areas:

```text
Trade Details
Add Trade
Daily Journal
Playbook
Setup Details
Profile
Authentication UI
Onboarding UI
```

---

# 4. Navigation

Use Expo Router.

Structure:

```text
app/
│
├── _layout.tsx
├── index.tsx
│
├── (auth)/
│   ├── _layout.tsx
│   ├── login.tsx
│   ├── register.tsx
│   └── onboarding.tsx
│
└── (app)/
    ├── _layout.tsx
    │
    ├── (tabs)/
    │   ├── _layout.tsx
    │   ├── index.tsx
    │   ├── trades.tsx
    │   ├── analytics.tsx
    │   ├── calendar.tsx
    │   └── settings.tsx
    │
    ├── trade/
    │   ├── new.tsx
    │   └── [id].tsx
    │
    ├── journal/
    │   └── daily.tsx
    │
    ├── playbook/
    │   ├── index.tsx
    │   └── [id].tsx
    │
    └── profile.tsx
```

---

# 5. Screen List

## Primary screens

### Dashboard

Display:

- Greeting
- Today's P&L
- Today's R
- Win rate
- Recent trades
- Current trading plan
- Quick journal action
- Daily review action

---

### Trades

Display:

- All trades
- Winning trades
- Losing trades
- Open trades
- Search
- Filters

Filters:

- Date
- Symbol
- Market
- Setup
- Session
- Direction
- Result

---

### Trade Details

Display:

- Symbol
- Direction
- Result
- P&L
- R-multiple
- Entry
- Stop loss
- Take profit
- Exit
- 4H bias
- 15M structure
- 5M confirmation
- Setup
- Session
- Psychology
- Checklist
- Screenshots
- Notes
- Lesson

---

### Add Trade

Sections:

1. Market
2. Direction
3. 4H bias
4. 15M structure
5. 5M confirmation
6. Setup
7. Entry
8. Stop loss
9. Take profit
10. Psychology
11. Checklist
12. Screenshot
13. Notes

Automatically calculate:

- Risk
- Reward
- R:R
- R-multiple where possible

---

### Analytics

Display:

- Total trades
- Win rate
- Net R
- Average R
- Average win
- Average loss
- Profit factor
- Drawdown
- Setup performance
- Market performance
- Session performance
- Rule adherence
- Psychology patterns

---

### Calendar

Display trading performance by date.

Selecting a date should display:

- Trades
- P&L
- R
- Daily journal

---

### Daily Journal

Fields:

- Mood
- Energy
- Focus
- Market outlook
- Plan
- What went well
- Mistakes
- Lessons
- Tomorrow's focus

---

### Playbook

Display:

- Trading setups
- Setup descriptions
- Rules
- Examples

---

### Setup Details

Display:

- Setup name
- Description
- Rules
- Example trades
- Statistics placeholder

---

### Settings

Display:

- Profile
- Trading preferences
- Currency
- Risk preferences
- App preferences

---

# 6. Folder Structure

```text
app/
│
components/
│
├── ui/
├── cards/
├── charts/
├── trades/
├── journal/
└── playbook/

data/
├── trades.ts
├── analytics.ts
├── setups.ts
├── journal.ts
└── user.ts

types/
├── trade.ts
├── analytics.ts
├── setup.ts
├── journal.ts
└── user.ts

constants/
├── colors.ts
├── spacing.ts
├── typography.ts
└── navigation.ts

hooks/

store/

utils/

services/
└── api/
    └── README.md

assets/
```

---

# 7. Dummy Data Rules

All current UI must use dummy data.

Dummy data must live in:

```text
data/
```

Never create large fake arrays directly inside screen components.

Bad:

```tsx
const trades = [
  ...
];
```

inside a screen.

Good:

```tsx
import { dummyTrades } from "@/data/trades";
```

---

# 8. Dummy Trade Data

Dummy data should resemble realistic trading records.

Example:

```ts
{
  id: "trade-001",
  symbol: "EURUSD",
  marketType: "forex",
  direction: "BUY",
  result: "WIN",
  rMultiple: 2.1,
  setup: "Demand Zone",
  session: "London",
  bias4H: "Bullish",
  structure15M: "Bullish",
  entryTimeframe: "5M"
}
```

Use multiple realistic markets:

```text
EURUSD
USDJPY
BTCUSD
Volatility 75
```

Use different outcomes:

```text
WIN
LOSS
BREAKEVEN
OPEN
```

---

# 9. TypeScript Types

Create shared types.

Example:

```ts
export type TradeDirection = "BUY" | "SELL";

export type TradeResult = "WIN" | "LOSS" | "BREAKEVEN" | "OPEN";

export interface Trade {
  id: string;
  symbol: string;
  marketType: string;
  direction: TradeDirection;
  result: TradeResult;
  rMultiple: number;
  setup: string;
  session: string;
  bias4H: string;
  structure15M: string;
  entryTimeframe: string;
}
```

Do not use `any` unless absolutely unavoidable.

---

# 10. Future API Boundary

The future backend will replace the dummy-data layer.

Current:

```text
Screen
  ↓
Dummy Data
```

Future:

```text
Screen
  ↓
Service / Query
  ↓
API
  ↓
Database
```

Do not make UI components depend directly on fetch/axios calls.

Create service boundaries so the future API can be introduced without rewriting the UI.

---

# 11. UI Design Principles

The application should feel like a modern trading application.

Prioritize:

- Dark interface
- Clean cards
- Strong typography
- Clear numerical hierarchy
- Consistent spacing
- Rounded surfaces
- Large touch targets
- Minimal clutter
- Smooth but restrained animations
- Clear positive/negative states

Avoid excessive gradients, shadows, animations, and decorative elements.

---

# 12. Responsive Design

The app must work on different phone sizes.

Use NativeWind for normal layout:

```tsx
<View className="flex-1 px-5">
```

Use `react-native-responsive-screen` for proportional dimensions when necessary:

```ts
const height = heightPercentageToDP("20%");
```

Do not use responsive-screen for every padding or margin.

Prefer NativeWind for normal spacing.

---

# 13. Component Rules

Build reusable components.

Examples:

```text
StatCard
TradeCard
TradeRow
SectionHeader
FilterChip
PrimaryButton
SecondaryButton
Input
SelectField
MoodSelector
ChecklistItem
EmptyState
LoadingState
ErrorState
```

Do not duplicate identical UI logic across screens.

---

# 14. Financial Calculation Rules

Financial calculations must be centralized.

Create utility functions for:

```text
calculateRisk()
calculateReward()
calculateRR()
calculateRMultiple()
calculatePnL()
```

Do not duplicate formulas in multiple components.

---

# 15. Authentication

Authentication UI may be created during the prototype.

However:

- No real authentication.
- No API authentication.
- No token storage.
- No backend session.
- No database user model.

The UI should simply demonstrate the intended flow.

---

# 16. Storage

Do NOT add:

```text
SQLite
AsyncStorage
MMKV
SecureStore
```

during the current UI prototype phase.

Data may reset when the application restarts.

This is intentional.

---

# 17. Backend

Do NOT create:

- Express server
- PostgreSQL
- Prisma
- API routes
- JWT
- Cloud storage

during the current phase.

The backend will be implemented later.

---

# 18. Broker Integration

Do NOT implement:

- Deriv API
- MT5
- Exness
- Broker authentication
- Automatic trade imports
- WebSockets

The journal must remain independent from broker integrations.

---

# 19. Analytics

Analytics should use dummy data during the prototype.

Examples:

```text
Win Rate
Net R
Average R
Average Win
Average Loss
Setup Performance
Session Performance
Market Performance
```

The visual structure should be production-ready even though the data is currently static.

---

# 20. Development Rules

Before changing code:

1. Inspect the existing implementation.
2. Reuse existing components.
3. Avoid unnecessary dependencies.
4. Do not rewrite working features.
5. Follow the existing architecture.
6. Keep TypeScript strict.
7. Keep screens focused.
8. Keep dummy data outside screens.
9. Keep business logic outside UI components.
10. Do not implement backend functionality.

After changes:

1. Run TypeScript checks.
2. Run lint.
3. Start Expo.
4. Test navigation.
5. Test affected screens.
6. Fix errors before continuing.

---

# 21. Current Priority

Build the application in this order:

```text
1. Project foundation
2. NativeWind
3. Responsive layout system
4. Expo Router
5. Theme
6. Shared UI components
7. Dummy data
8. Dashboard
9. Trades
10. Trade Details
11. Add Trade
12. Analytics
13. Calendar
14. Daily Journal
15. Playbook
16. Settings
17. Authentication UI
18. Final polish
```

Do not start backend work.

---

# 22. Definition of Done

The prototype is complete when:

- Every planned screen exists.
- Navigation works.
- Dummy data appears realistic.
- Components are reusable.
- Responsive layouts work.
- NativeWind is used consistently.
- Forms work locally.
- Calculations work.
- Analytics render correctly.
- No major TypeScript errors exist.
- No navigation errors exist.
- No unnecessary backend/local database exists.

---

# 23. Future Version

After the UI prototype is approved, the next phase will introduce:

```text
Expo App
    ↓
API Server
    ↓
Database
```

Possible future features:

- Authentication
- Cloud synchronization
- PostgreSQL
- Broker integration
- Deriv integration
- MT5 integration
- Automatic trade import
- Cloud screenshot storage
- Advanced analytics
- AI trade review

Do not implement these features until explicitly requested.
