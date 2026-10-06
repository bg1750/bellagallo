# GitHub Deploy Guide — Bellagallo Personal Site

Live URL: https://bg1750.github.io/bellagallo

---

## First-Time Setup (already done — skip this)

```bash
cd /c/Users/bellag0808/Desktop/FrontendCourses/frontend_Projects/Capstone\ Project\ 2\ Personal\ Site

git init
git add .
git commit -m "initial personal site"
git branch -M main
git remote add origin https://github.com/bg1750/bellagallo.git
git push -u origin main
```

If you ever get "remote origin already exists", use this instead of git remote add:
```bash
git remote set-url origin https://github.com/bg1750/bellagallo.git
```

---

## Pushing Updates (use this every time you make changes)

1. Open Git Bash and navigate to the project folder:
```bash
cd /c/Users/bellag0808/Desktop/FrontendCourses/frontend_Projects/Capstone\ Project\ 2\ Personal\ Site
```

2. Stage, commit, and push your changes:
```bash
git add .
git commit -m "describe what you changed here"
git push
```

GitHub Pages will automatically update the live site within ~1 minute.

---

## Check What's Currently Set as Remote

```bash
git remote -v
```

Should show: https://github.com/bg1750/bellagallo.git

---

## GitHub Pages Settings

- Repo: https://github.com/bg1750/bellagallo
- Settings → Pages → Branch: main, Folder: / (root)
- Live site: https://bg1750.github.io/bellagallo
