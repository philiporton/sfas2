import { Tooltip, OverlayTrigger, Button } from "react-bootstrap";

export default function TooltipHover({ text }: { text: string }) {
    const tooltipContent = <Tooltip>{text}</Tooltip>;

    return (
        <OverlayTrigger trigger={["hover", "focus"]} overlay={tooltipContent}>
            <Button
                style={{
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "blue",
                    justifyContent: "center"
                }}
            >
                ?
            </Button>
        </OverlayTrigger>
    );
}
