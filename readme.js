import fs from "fs/promises"

const readmeContent = `# GINIS Dashboard

This project is a Next.js-based dashboard for the GINIS (Geographic Information System) application.

## Prerequisites

- Node.js 14.x or later
- npm 6.x or later

## Getting Started

Follow these steps to run the project on your local machine:

1. Clone the repository:
   \`\`\`
   git clone <repository-url>
   cd ginis-dashboard
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`
   npm run dev
   \`\`\`

4. Open your browser and navigate to \`http://localhost:3000\` to view the dashboard.

## Available Scripts

In the project directory, you can run:

- \`npm run dev\`: Runs the app in development mode.
- \`npm run build\`: Builds the app for production.
- \`npm start\`: Runs the built app in production mode.
- \`npm run lint\`: Runs the linter to check for code style issues.

## Project Structure

- \`app/\`: Contains the main application code.
- \`components/\`: Reusable React components.
- \`lib/\`: Utility functions and helpers.
- \`public/\`: Static assets.

## Dependencies

This project uses the following main dependencies:

- Next.js
- React
- Recharts
- Lucide React
- Tailwind CSS
- Date-fns

For a full list of dependencies, please refer to the \`package.json\` file.

## Contributing

Please read the CONTRIBUTING.md file for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
`

await fs.writeFile("README.md", readmeContent)
console.log("README.md file has been created successfully.")

