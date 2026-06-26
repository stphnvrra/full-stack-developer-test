# Inventory Tracker — Technical Test

A small inventory page built with plain HTML, CSS, and JavaScript (no frameworks).

## How to run

Open `index.html` in any modern browser. No build step or server required.

```bash
open index.html
```

## What it does

- **Pacific Time clock** — live clock in `America/Los_Angeles`, updates every second.
- **Add items** — name, quantity, and unit price via the form.
- **Summary cards** — total leftover quantity and total leftover value (qty × price) update instantly.
- **Item list** — each row shows name, quantity, and unit price.
- **Use** — decrements that item's quantity by 1; summary cards update immediately.
- **Delete** — removes the item from the list.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure and styles |
| `app.js` | All application logic |

## Approach

Single source of truth: an `items` array in memory. Every action (add, delete, use) mutates the array and calls `render()` to refresh the DOM. Event delegation on the list handles Use/Delete clicks without per-row listeners.

Totals are derived on each render by reducing over `items` — no separate state to keep in sync.
