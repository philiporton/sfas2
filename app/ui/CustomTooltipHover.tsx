/**
 * tooltip that appears on hover, with a custom style added (as `content` jsx element)
 */

import { Tooltip, OverlayTrigger } from "react-bootstrap";

export default function TooltipHover({
    tooltipText,
    content
}: {
    tooltipText: string;
    content: JSX.Element;
}) {
    const tooltipContent = <Tooltip>{tooltipText}</Tooltip>;

    return (
        <OverlayTrigger trigger={["hover", "focus"]} overlay={tooltipContent}>
            {content}
        </OverlayTrigger>
    );
}
