interface CEOProps {
  url: string;
  image: string;
  title: string;
  description: string;
  themeColor: string;
  countryName: string;
  website?: string;
  email: string;
  language: string;
  phoneNumber: string;
  author: string;
  keywords?: string;
}

export default function SEO({
  url,
  image,
  title,
  description,
  themeColor,
  countryName,
  website,
  email,
  language,
  phoneNumber,
  author,
  keywords,
}: CEOProps) {
  return (
    <>
      <link rel="manifest" href="/manifest.json" />
      <meta
        name="image"
        content="https://api.microlink.io?url=https://avisos.jonatas.app&screenshot=true&meta=false&embed=screenshot.url"
      />

      <meta
        itemProp="image"
        content="https://api.microlink.io?url=https://avisos.jonatas.app&screenshot=true&meta=false&embed=screenshot.url"
      />

      <meta
        property="og:image"
        content="https://api.microlink.io?url=https://avisos.jonatas.app&screenshot=true&meta=false&embed=screenshot.url"
      />

      <meta
        name="twitter:image"
        content="https://api.microlink.io?url=https://avisos.jonatas.app&screenshot=true&meta=false&embed=screenshot.url"
      />

      <meta name="description" content={description} />

      <meta name="author" content={author} />

      <meta name="keywords" content={keywords} />

      <meta name="robots" content="index, follow" />

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1"
      />
      <meta property="og:url" content={url} />

      <meta property="og:title" content={title} />

      <meta property="og:image" content={image} />

      <meta property="og:description" content={description} />

      <meta name="theme-color" content={themeColor} />

      <meta
        property="business:contact_data:country_name"
        content={countryName}
      />

      <meta property="business:contact_data:website" content={website} />

      <meta property="business:contact_data:email" content={email} />

      <meta
        property="business:contact_data:phone_number"
        content={phoneNumber}
      />

      <meta name="twitter:card" content="summary" />

      <meta name="twitter:description" content={description} />

      <meta name="twitter:title" content={title} />

      <meta name="twitter:image" content={image} />

      <meta name="geo.region" content="BR-TO" />
      <meta name="geo.placename" content="Palmas" />
      <meta name="geo.position" content="-10.240764;-48.337626" />
      <meta name="ICBM" content="-10.240764, -48.337626" />

      <meta name="description" content={description} />

      <meta property="og:type" content="website" />

      <meta property="og:locale" content={language} />

      <meta name="format-detection" content="telephone=no" />
    </>
  );
}
