import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old tarus.cz ran the e-shop directly on this domain; that catalog now
  // lives on eshop.tarus.cz under a different URL scheme (/katalog/.../ID).
  // Google still has the old paths indexed, so they 404 without these.
  async redirects() {
    return [
      {
        source: "/kategorie/tesarske-kovani-a-skryte-spoje",
        destination: "https://eshop.tarus.cz/katalog/tesarske-kovani-a-skryte-spoje/18",
        permanent: true,
      },
      {
        source: "/kategorie/parozabrany-a-difuzni-folie",
        destination: "https://eshop.tarus.cz/katalog/membrany/16",
        permanent: true,
      },
      {
        source: "/kategorie/konstrukcni-vruty-nastrelovaci-hrebiky-a-spony",
        destination: "https://eshop.tarus.cz/katalog/spojovaci-material/1",
        permanent: true,
      },
      {
        source: "/znacky/:path*",
        destination: "https://eshop.tarus.cz/znacky",
        permanent: true,
      },
      {
        source: "/kontakty-a-prodejny",
        destination: "https://eshop.tarus.cz/kontakty",
        permanent: true,
      },
      {
        source: "/o-firme",
        destination: "/#o-nas",
        permanent: true,
      },
      {
        source: "/obchodni-zastupci-a-specialiste",
        destination: "/#kontakt",
        permanent: true,
      },
      {
        source: "/ke-stazeni",
        destination: "/",
        permanent: true,
      },
      // Technical-sheet PDFs from the old site. The e-shop hosts the same
      // files but under new product IDs, so map the known ones explicitly.
      {
        source: "/uploads/product/29/doc/tarus-tape-extreme-white.pdf",
        destination: "https://eshop.tarus.cz/uploads/product/372/doc/tarus-tape-extreme-white.pdf",
        permanent: true,
      },
      {
        source: "/uploads/product/33/doc/tarus-tape-thermo.pdf",
        destination: "https://eshop.tarus.cz/uploads/product/173/doc/tarus-tape-thermo.pdf",
        permanent: true,
      },
      {
        source: "/uploads/product/17/doc/tarus-fassade-50-2sk.pdf",
        destination: "https://eshop.tarus.cz/katalog/membrany/16",
        permanent: true,
      },
      {
        source: "/uploads/:path*",
        destination: "https://eshop.tarus.cz/katalog",
        permanent: true,
      },
      {
        source: "/kategorie/terasove-a-fasadni-systemy",
        destination: "https://eshop.tarus.cz/katalog/terasove-a-fasadni-systemy/19",
        permanent: true,
      },
      {
        source: "/kategorie/:path*",
        destination: "https://eshop.tarus.cz/katalog",
        permanent: true,
      },
      {
        source: "/produkty/:path*",
        destination: "https://eshop.tarus.cz/katalog",
        permanent: true,
      },
      {
        source: "/kontakt",
        destination: "https://eshop.tarus.cz/kontakty",
        permanent: true,
      },
      {
        source: "/novinky/:path*",
        destination: "https://eshop.tarus.cz/blog",
        permanent: true,
      },
      {
        source: "/english",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
