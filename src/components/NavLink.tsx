import React from "react";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";

/**
 * returns true if the current path is the same as the target path (i.e. current path is active)
 *
 * @param {string} currPath
 * @param {string} target
 *
 * @returns {boolean}
 */
export const isActive = (currPath: string, target: string): boolean => {
    if (currPath.endsWith("/") && currPath.length !== 1)
        currPath = currPath.slice(0, currPath.length - 1);
    return currPath === target; // check for trailing
};

export default function NavLink({ pathName, displayName }: { pathName: string, displayName: string }) {
    return (
        <Nav.Link as={Link} className={
            "px-2 mx-2" +
            (isActive(window.location.pathname, pathName)
                ? " active"
                : "")
            }
            to={
                isActive(window.location.pathname, pathName)
                    ? "#"
                    : pathName
            }
        >
            {displayName}
        </Nav.Link>
    );
}