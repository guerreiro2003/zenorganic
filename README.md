# Zen Organic Hair Concept

Marketing website for Zen Organic Hair Concept (Telheiras, Lisboa).
Static HTML/CSS/JS, with an admin panel for content management
stored in browser localStorage.

> **🌐 Production:** [https://zen-organic-pt.web.app](https://zen-organic-pt.web.app)
> **🔗 Booking app:** [https://bookit-51575.web.app/?salon=zenorganic](https://bookit-51575.web.app/?salon=zenorganic)

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Public landing page |
| `admin.html` | Content admin (local-only, password: `zen2025`) |
| `styles.css` | Design system |
| `script.js` | Dynamic content loaders + popup |

## How to update

```bash
cd zenorganic-main
# edit HTML/CSS
git add .
git commit -m "Update copy"
git push                                       # GitHub
firebase deploy --only hosting:zen-organic-pt  # publish
```

## Companion project

This site is the marketing front for the **Book It** booking app:
[github.com/guerreiro2003/bookit](https://github.com/guerreiro2003/bookit).
The "Marcar Agora" buttons point to `bookit-51575.web.app/?salon=zenorganic`.
