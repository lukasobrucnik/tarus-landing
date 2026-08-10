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
    ];
  },
};

export default nextConfig;
