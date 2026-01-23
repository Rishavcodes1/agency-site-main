import { Helmet } from "react-helmet-async";

type ForSeoProps = {
    title: string,
    description: string,
    path: string,
    type?: "website",
    image?: 'https://www.acurve.in/acurve.png'
}

const ForSeo = ({
    title,
    description,
    path,
    type = "website",
    image = "https://www.acurve.in/acurve.png"
}: ForSeoProps) => {
    return (
        <Helmet>
            {/* Basic SEO */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={`https://acurve.in${path}`} />

            {/* Open Graph / Facebook */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={`https://acurve.in${path}`} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Optional: viewport */}
        </Helmet>
    );
};

export default ForSeo;
