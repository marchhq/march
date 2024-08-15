import { type Metadata } from "next"

export const BASE_URL = "https://example.com" // Don't include slash at the end

interface MetadataArgs {
  path: string
  title: string
  description: string
  image?: string
}

const generateMetadata = ({
  path,
  title,
  description,
  image,
}: MetadataArgs): Metadata => {
  const metaTitle = title
  const metaDescription = description
  const metaImage = image ?? `${BASE_URL}/cover.png`

  const metadata: Metadata = {
    title: metaTitle,
    description: metaDescription,

    applicationName: "<Application Name>",
    creator: "<Creator Name>",
    authors: [{ name: "<Author Name>", url: "<Author Name or Email>" }],
    robots:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    keywords: [
      "Next.js",
      "TailwindCSS",
      "Framer Motion",
      "TypeScript",
      "Akar Icons",
      "ESLint",
      "Prettier",
      "JavaScript",
      "Postgres",
    ],

    icons: {
      icon: "/favicon.ico",
      shortcut: "/icons/icon-512x512.png",
      apple: "/icons/icon-512x512.png",
    },
    manifest: `${BASE_URL}/manifest.json`,

    openGraph: {
      type: "website",
      url: `${BASE_URL}${path}`,
      siteName: "<Site Name>",
      title: metaTitle,
      description: metaDescription,
      images: metaImage,
      // videos: "",  // INFO: og video option
    },

    twitter: {
      card: "summary_large_image",
      site: "@site",
      creator: "@creator",
      title: metaTitle,
      description: metaDescription,
      images: metaImage,
    },

    appleWebApp: {
      capable: true,
      title: metaTitle,
      startupImage: metaImage,
      statusBarStyle: "black-translucent",
    },

    formatDetection: {
      telephone: true,
      date: true,
      address: true,
      email: true,
      url: true,
    },

    appLinks: {},
  }
  return metadata
}

export default generateMetadata
