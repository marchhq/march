<img
march
```ai second brain, opinionatedly designed for makers;
```
### About
march is a notion alternative for getting things done— we wished existed, so we're building it ourselves. We tried Notion, Obsidian, Anytpe, Todoist , etc but none of them felt quite right. Those are good apps so if they work well for you, we're not saying march will be better for you. Here's what march is:

	- march is connected with all your favourite tools and automatically collects action items from them which you can view in a universal inbox.

	- march treats everything as objects with types be it your meeting, bookmark or linear issue, you can customise the view of an object by its type.

	- the dynamic interface of march allows you to create your own productivity space with blocks.

	- no tedious templates, march can automatically organise your stuff as per your behaviour and object types.

	- it can plan your day, perform actions in connected apps and be your accountability partner who constantly pushes you to get things done or relax when needed.


march is currently  free and open source project maintained by me ( @oliursahin) and @sajdakabir)
here you can buy us a coffee if you love using it— it helps us keep up the servers.


> it is still in the alpha stage, and only suitable for use by enthusiastic testers willing to endure an incomplete app with bugs. However, it's our own daily driver and we're actively developing it.
### #try the alpha
- app.march.cat
- march is not ready for production use yet.
- We give access to early testers who can help us test the app as we're building it.

#### Contributing
- We <3 contributions.
- Bear in mind that the project is under heavy development and we don't have a proccess for accepting contributions yet.
- Submit a feature request or bug report.

#### 
to get a local copy up an running:
### prerequisites
here is what you need to run emptyarray.
- node.js (version: >=18.x)
- bun (recommended)
### development
#### setup
1. clone the repository with or without a shallow clone
```git clone --depth=1 https://github.com/emptyarrayhq/emptyarray.git
```
1. switch to the project folder
```cd emptyarray
```
1. create your feature or fix branch you plan to work on using
```git checkout -b <feature-branch-name>
```
1. install packages with bun
```bun install

```
1. set up your .env file
Go to the app/backend and app/frontend directories and duplicate the .env.example to .env.
1. run (in development mode)
```bun dev

```
#### linear integration
to set up the Linear integration:
1. sign up for a Linear account at https://linear.app if you haven't already.
2. create a new Linear OAuth application in your Linear settings.
3. fill in the following environment variables in your .env file:
```LINEAR_REDIRECT_URL=http://localhost:3000/auth/linear
LINEAR_CLIENT_ID=<your_linear_client_id>
LINEAR_CLIENT_SECRET=<your_linear_client_secret>
```
Replace <your_linear_client_id> and <your_linear_client_secret> with the values provided by Linear for your OAuth application.

