# Mobile Offline Code Editor Integration Guide

## 1. Prerequisites

- React Native project (Expo or CLI)
- Install `@react-native-async-storage/async-storage`

```
npm install @react-native-async-storage/async-storage
```

## 2. Usage

- Place `OfflineCodeEditor.js` in your mobile/components or mobile/ directory.
- Import and use in your screen:

```jsx
import OfflineCodeEditor from "./OfflineCodeEditor";

<OfflineCodeEditor problem={problemObj} language="javascript" />;
```

- `problemObj` should have at least an `id` and `title`.

## 3. Features

- Code is saved offline per problem and language
- Template code is loaded for new problems
- Extend with syntax highlighting, code execution, and AI hints as needed

## 4. Extension Tips

- Integrate with a code execution API for offline/online runs
- Add syntax highlighting using libraries like `react-native-syntax-highlighter`
- Add AI hint and review buttons
- Sync code with backend when online
