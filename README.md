## getting Started

to get a local copy up and running, please follow these simple steps.

## prerequisites

here is what you need to run emptyarray.

- node.js (version: >=18.x)
- bun (recommended)

## development

### setup

1. clone the repository with or without a shallow clone

```
git clone --depth=1 https://github.com/emptyarrayhq/emptyarray.git
```

2. switch to the project folder

```
cd emptyarray
```

3. create your feature or fix branch you plan to work on using

```
git checkout -b <feature-branch-name>
```

4. install packages with bun

```
bun install

```

5. set up your .env file

Go to the `app/backend` and `app/frontend` directories and duplicate the `.env.example` to `.env`.

6. run (in development mode)

```
bun dev

```

### linear integration

to set up the Linear integration:

1. sign up for a Linear account at https://linear.app if you haven't already.
2. create a new Linear OAuth application in your Linear settings.
3. fill in the following environment variables in your `.env` file:

```
LINEAR_REDIRECT_URL=http://localhost:3000/auth/linear
LINEAR_CLIENT_ID=<your_linear_client_id>
LINEAR_CLIENT_SECRET=<your_linear_client_secret>
```

Replace `<your_linear_client_id>` and `<your_linear_client_secret>` with the values provided by Linear for your OAuth application.
