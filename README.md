## Getting Started

To get a local copy up and running, please follow these simple steps.

## Prerequisites

Here is what you need to run march.

- Node.js (Version: >=18.x)
- pnpm (recommended)

## Development

### Setup

1. Clone the repo into a public GitHub repository

```
https://github.com/marchhq/march.git

```

2. Switch to the project folder

```
cd march
```

3. Create your feature or fix branch you plan to work on using

```
git checkout -b <feature-branch-name>
```

4. Install packages with pnpm

```
bun install

```

5. Set up your .env file

Go to the `app/backend` and `app/frontend` directories and duplicate the `.env.example` to `.env`.

6. Run (in development mode)

```
bun dev

```

### Linear integration

To set up the Linear integration:

1. Sign up for a Linear account at https://linear.app if you haven't already.
2. Create a new Linear OAuth application in your Linear settings.
3. Fill in the following environment variables in your `.env` file:

```
LINEAR_REDIRECT_URL=http://localhost:3000/auth/linear
LINEAR_CLIENT_ID=<your_linear_client_id>
LINEAR_CLIENT_SECRET=<your_linear_client_secret>
```

Replace `<your_linear_client_id>` and `<your_linear_client_secret>` with the values provided by Linear for your OAuth application.
