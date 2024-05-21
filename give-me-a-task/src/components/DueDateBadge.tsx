import { distanceFromNow, formatDate } from "../functions";

type DueDateBadgeProps = {
    date: string
}

const DueDateBadge = ({ date }: DueDateBadgeProps) => {
    let bgColor;
    let textColor;
    const numDaysFromNow = distanceFromNow(date);
    if (numDaysFromNow < 7) {
        // Yellow
        bgColor = "#ffe34d";
        textColor = "#191500";
    }
    if (numDaysFromNow < 3) {
        // Orange
        bgColor = "#ff8000";
        textColor = "#190e00";
    }
    if (numDaysFromNow < 1) {
        // Light red
        bgColor = "#f33";
        textColor = "#190707";
    }
    if (numDaysFromNow < 0) {
        // Strong red
        bgColor = "#800000";
        textColor = "#f2e6e6";
    }

    const style = {
        color: textColor,
        backgroundColor: bgColor
    }

    return (
        <div
            style={style}
            className="text-light text-xs px-2 rounded-lg font-semibold transition-colors">
            Due {formatDate(date)}
        </div>
    );
}

export default DueDateBadge;