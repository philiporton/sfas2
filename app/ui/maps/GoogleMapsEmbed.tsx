export default function GoogleMapsEmbed({
    mapsAPIKey
}: {
    mapsAPIKey: string;
}) {
    return (
        <iframe
            width="600"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=${mapsAPIKey}&q=Space+Needle,Seattle+WA`}
        ></iframe>
    );
}
