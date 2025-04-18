# ![march](https://your-logo-url.com/logo.png)

```txt
ai second brain, opinionatedly designed for makers.
```

## About
march is a notion alternative for getting things done—the tool we wished existed, so we're building it ourselves. We've tried Notion, Obsidian, Anytype, Todoist, etc., but none of them felt quite right. Those are great apps, and if they work for you, we're not saying March will be better. But here’s what makes March different:

- **Connected Workflow:** March integrates with all your favorite tools and automatically collects action items into a universal inbox.
- **Simple Object-Based System:** Everything—meetings, bookmarks, Linear issues—is treated as an object with a type. You can customize views based on object types.
- **Dynamic Interface:** Build your own productivity page/ space with blocks, you decide how your action items should look like.
- **Smart Organization:** No tedious templates—March organizes your data dynamically based on behavior and object types.
- **AI-Powered Productivity:** Plan your day, perform actions in connected apps, and stay accountable. march pushes you to get things done—or take breaks when needed.

March is currently **free and open source**, maintained by **[@oliursahin](https://github.com/oliursahin)** and **[@sajdakabir](https://github.com/sajdakabir)**. If you love using it, consider [buying us a coffee](https://buymeacoffee.com/oliursahin)—it helps us keep the servers running.

> **Alpha Notice:** march is still in an alpha stage and is only suitable for enthusiastic testers willing to endure bugs and an incomplete app. However, it's our daily driver, and we are actively developing it.

## 🚀 Try the Alpha
- **[app.march.cat](https://app.march.cat)**
- March is **not ready for production use** yet.
- We provide access to early testers who can help us improve the app as we build it.

---

## 🤝 Contributing
- We ❤️ contributions.
- The project is under **heavy development**, and we don’t have a structured contribution process yet.
- Submit a **feature request** or **bug report**.

---

## 🛠️ Getting Started
### Prerequisites
To run march locally, you need:
- Node.js (version: **>=18.x**)
- Bun (**recommended**)

### Development Setup
1. **Clone the repository:**
   ```sh
   git clone --depth=1 https://github.com/marchhq/march.git
   ```

2. **Navigate to the project folder:**
   ```sh
   cd march
   ```

3. **Create your feature or fix branch:**
   ```sh
   git checkout -b <feature-branch-name>
   ```

4. **Install dependencies with Bun:**
   ```sh
   bun install
   ```

5. **Set up your environment variables:**
   - Go to `apps/backend` and `apps/web` directories.
   - Duplicate `.env.example` and rename it to `.env`.

6. **Run the development server:**
   ```sh
   bun dev
   ```

---

## 🔗 Linear Integration
To set up the **Linear** integration:

1. **Sign up for a Linear account** at [linear.app](https://linear.app).
2. **Create a new Linear OAuth application** in your Linear settings.
3. **Add the following environment variables** to your `.env` file:
   ```sh
   LINEAR_REDIRECT_URL=http://localhost:3000/auth/linear
   LINEAR_CLIENT_ID=<your_linear_client_id>
   LINEAR_CLIENT_SECRET=<your_linear_client_secret>
   ```
   Replace `<your_linear_client_id>` and `<your_linear_client_secret>` with the values provided by Linear.

---

### 📝 License
March is **open source** and licensed under [MIT](LICENSE).

