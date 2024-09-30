import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav } from "react-bootstrap";

export default function NavLink({
    pathName,
    displayName
}: {
    pathName: string;
    displayName: string;
}) {
    const path = usePathname();

    return (
        <Nav.Link
            as={Link}
            className={"px-2 mx-2" + (path === pathName ? " active" : "")}
            href={pathName}
        >
            {displayName}
        </Nav.Link>
    );
}
