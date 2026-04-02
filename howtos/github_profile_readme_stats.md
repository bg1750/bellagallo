# GitHub Profile README + Stats Setup

How to set up a GitHub profile README with live stats cards that don't rate-limit.

Live result: https://github.com/bg1750

---

## What This Does

GitHub has a special feature: if you create a **public repo named exactly the same as your username** (e.g. `bg1750/bg1750`), the `README.md` in that repo displays on your GitHub profile homepage.

The stats cards (commits, top languages, streak) are powered by a self-hosted instance of `github-readme-stats` deployed on Vercel so they never hit rate limits.

---

## Part 1 — Profile README Repo

### Create the repo correctly

The repo **must** be created fresh on GitHub with the README checkbox — not pushed externally, not a fork.

1. Go to https://github.com/new
2. Name it exactly `bg1750` (your username)
3. Set to **Public**
4. Check **"Add a README file"**
5. Click **Create repository**

> If the repo already exists and the profile README isn't showing, delete it (Settings → scroll to bottom → Delete repository) and recreate it following the steps above. Pushing to an existing repo can prevent GitHub from registering the profile README feature.

### Push your content

Local folder: `C:/Users/bellag0808/Desktop/FrontendCourses/bg1750`

```bash
cd /c/Users/bellag0808/Desktop/FrontendCourses/bg1750
git push origin main --force
```

---

## Part 2 — Self-Hosted Stats (Vercel)

The public `github-readme-stats.vercel.app` is rate-limited by millions of users. Self-hosting gives you your own GitHub API quota.

### Step 1 — Fork the repo

Go to https://github.com/anuraghazra/github-readme-stats and click **Fork → Create fork**.

### Step 2 — Create a GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click **Generate new token → Generate new token (classic)**
3. Set expiration to **No expiration**
4. Check these two scopes: `read:user` and `repo`
5. Click **Generate token** — copy it immediately, you won't see it again

### Step 3 — Deploy to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click **Add New → Project**
3. Import your forked `github-readme-stats` repo
4. Before deploying, open **Environment Variables** and add:
   - Name: `PAT_1`
   - Value: *(your token from Step 2)*
5. Click **Deploy**

### Step 4 — Disable Deployment Protection

By default Vercel protects deployments behind authentication, which blocks the stat card images.

1. Go to your project → **Settings → Deployment Protection**
2. Turn off **Vercel Authentication**
3. Save — no redeploy needed

### Step 5 — Get your deployment URL

From the Vercel dashboard, copy your deployment URL. It looks like:
```
github-readme-stats-xxxxxxxx-bg1750s-projects.vercel.app
```

Current URL: `github-readme-stats-3rwxnxurg-bg1750s-projects.vercel.app`

---

## Part 3 — README URLs

Use your Vercel URL in the README image tags:

**Stats card:**
```
https://github-readme-stats-3rwxnxurg-bg1750s-projects.vercel.app/api?username=bg1750&show_icons=true&theme=dark&bg_color=0D0D0D&title_color=9940FF&icon_color=9940FF&text_color=D4CFC9&border_color=333333&count_private=true
```

**Top languages:**
```
https://github-readme-stats-3rwxnxurg-bg1750s-projects.vercel.app/api/top-langs/?username=bg1750&layout=compact&theme=dark&bg_color=0D0D0D&title_color=9940FF&text_color=D4CFC9&border_color=333333&langs_count=8
```

**Streak (demolab — reliable, no self-hosting needed):**
```
https://streak-stats.demolab.com?user=bg1750&theme=dark&background=0D0D0D&ring=9940FF&fire=9940FF&currStreakLabel=9940FF&sideLabels=D4CFC9&dates=555555&border=333333
```

---

## Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Profile README not showing | Repo was pushed externally or is a fork | Delete repo, recreate with "Add a README" checkbox, force push |
| Stats card shows "error fetching" | Public Vercel instance rate limited | Self-host on Vercel (Part 2 above) |
| Stats card shows 401 | Token missing or wrong scopes | Re-add PAT_1 in Vercel env vars with `read:user` + `repo` scopes, redeploy |
| Stats card still 401 after token fix | Vercel Deployment Protection is on | Settings → Deployment Protection → disable Vercel Authentication |
