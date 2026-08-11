bike-shop-app/README.md
# 🚲 Bike Shop App

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss&logoColor=white)

A full-stack storefront for a bike shop — built to take a visitor from "just browsing" to "checking spec sheets" without ever feeling like a spreadsheet of inventory. Every screen, from the catalog grid to the reviews section, is designed around how people actually shop for something they'll own for years.

## Highlights

- **Filterable catalog** — narrow the grid by category, condition, and sort order without a full page reload
- **Per-bike detail pages** — image gallery, a size/color variant picker, and a full spec sheet for every model
- **Google Reviews, wired for reality** — pulls live reviews, but degrades gracefully if the API's ever unavailable instead of breaking the page
- **Built on the App Router** — server components where they help load time, client interactivity where the UX needs it

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Styling | Tailwind CSS 4 |
| Language | TypeScript |

## Project Structure

bike-shop-app/
├── app/                    # routes (App Router)
├── components/
│   ├── BikeCard.tsx
│   ├── BikeGrid.tsx
│   ├── CatalogFilters.tsx
│   ├── GoogleReviewsSection.tsx
│   ├── ImageGallery.tsx
│   ├── SiteHeader.tsx
│   ├── SiteFooter.tsx
│   ├── SpecSheet.tsx
│   └── VariantPicker.tsx
├── lib/                    # shared utilities
└── public/                 # static assets

## Getting Started

```bash
npm install
npm run dev
