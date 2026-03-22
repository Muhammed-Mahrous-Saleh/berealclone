export const formatTimeAgo = (createdAt: string) => {
    const now = new Date();
    const createdAtDate = new Date(createdAt);
    const timeDiff = now.getTime() - createdAtDate.getTime();
    const minutes = Math.floor(timeDiff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    let message = "";

    if (years > 0) {
        message = `${years} year${years > 1 ? "s" : ""} ago`;
    } else if (months > 0) {
        message = `${months} month${months > 1 ? "s" : ""} ago`;
    } else if (days > 0) {
        message = `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
        message = `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
        message = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
        message = "just now";
    }
    return message;
};

export const formatTimeRemaining = (expires_at: Date) => {
    const now = new Date();
    const expiresAt = new Date(expires_at);
    const timeDiff = expiresAt.getTime() - now.getTime();

    if (timeDiff <= 0) {
        return "Expired";
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor(timeDiff / (1000 * 60));

    let message = "";

    if (hours > 0) {
        message = `${hours}h `;
    }
    if (minutes > 0) {
        if (message !== "") {
            message += `and ${minutes - hours * 60}m `;
        } else {
            message += `${minutes}m `;
        }
    }
    return `${message}left`;
};
