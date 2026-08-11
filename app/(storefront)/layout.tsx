import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

// This wraps only the public storefront pages (app/(storefront)/**) --
// the (storefront) folder name is a Next.js route group, so it does NOT
// appear in the URL. "/" and "/bikes/[id]" are unchanged. Routes outside
// this group, like /admin/*, don't get this layout at all.

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-frame focus:text-paper focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}