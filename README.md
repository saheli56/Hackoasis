# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Cloud Optimizer Onboarding (Option B + CSV Import Option C)

This project now includes a first-time setup wizard (`CompanySetupWizard`) that lets you:

1. Enter a company profile (name, industry, size, contact email)
2. Add cloud instances manually (Option B)
3. Bulk import instances from a CSV file (Option C)
4. Review & finalize to unlock the dashboard

### Local Development

Frontend (Vite):
```
npm install
npm run dev
```

Backend (Express + Gemini AI):
```
cd backend
npm install
npm run dev
```

Set a `.env` file in `backend/`:
```
PORT=5000
GEMINI_API_KEY=your_key_here
```

### API Endpoints Implemented

Base: `http://localhost:5000/api/company`

| Method | Path | Purpose |
| ------ | ---- | ------- |
| POST | /profile | Save company profile |
| GET  | /profile | Fetch company profile |
| POST | /instance | Add single instance |
| GET  | /instances | List all instances |
| POST | /import-csv | Bulk import instances via CSV upload (field name: `file`) |

AI Recommendations: `POST /api/ai/recommendations` (Gemini powered)

### CSV Format

Required header row (lowercase, exact order):
```
name,provider,region,type,cpu,memoryGb,storageGb,monthlyCost,environment
```

Example rows:
```
api-server-01,aws,us-east-1,t3.medium,2,4,50,42,prod
cache-node-01,gcp,us-central1,n2-standard-2,2,8,30,55,staging
worker-01,azure,eastus,B2s,2,4,20,25,dev
```

Field Notes:
- provider: one of aws | gcp | azure
- environment: prod | staging | dev
- cpu, memoryGb, storageGb, monthlyCost: numeric (integers or floats)

### State & Persistence

During onboarding partial progress is stored in `localStorage` keys:
```
onboard_profile
onboard_instances
onboarding_completed (set to 'true' after Finish Setup)
```

### Future Enhancements (Ideas)

- Replace in-memory backend storage with a real database (PostgreSQL or MongoDB)
- Authentication & multi-tenant separation by company
- Pagination & filtering for large instance lists
- Import validation report UI (currently returns errors JSON structure)
- Editing & deleting instances after import

### Troubleshooting

| Issue | Resolution |
| ----- | ---------- |
| CSV rejected (headers) | Ensure exact header line matches required order & casing. |
| 400 on /instance | Check that numeric fields are numbers; provider/environment enums valid. |
| AI recommendations error | Confirm `GEMINI_API_KEY` is set and backend console for details. |
| Wizard reappears after refresh | Confirm `localStorage.onboarding_completed === 'true'`. |

