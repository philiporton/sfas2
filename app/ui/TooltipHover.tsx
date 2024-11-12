import { Button } from "react-bootstrap";
import CustomTooltipHover from "@/app/ui/CustomTooltipHover";

export default function TooltipHover({ tooltipText }: { tooltipText: string }) {
    const defaultTooltipObject = (
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
    );

    return (
        <CustomTooltipHover
            tooltipText={tooltipText}
            content={defaultTooltipObject}
        />
    );
}
