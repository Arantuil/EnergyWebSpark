export const daysLeft = (deadline) => {
    const difference = new Date(deadline).getTime() - Date.now();
    let remainingDays = difference / (1000 * 3600 * 24);

    if (remainingDays < 0) {
        remainingDays = 0
    }

    return remainingDays.toFixed(0);
};

export const hoursLeft = (deadline) => {
    const difference = new Date(deadline).getTime() - Date.now();
    const remainingHoursTotal = difference / (1000 * 3600);

    let remainingHours = remainingHoursTotal % 24;

    if (remainingHours < 0) {
        remainingHours = 0;
    }

    return remainingHours.toFixed(0);
};

export const minutesLeft = (deadline) => {
    const difference = new Date(deadline).getTime() - Date.now();
    const remainingMinutesTotal = difference / (1000 * 60);

    let remainingMinutes = remainingMinutesTotal % 24*60;

    if (remainingMinutes < 0) {
        remainingMinutes = 0;
    }

    return remainingMinutes.toFixed(0);
};

export const calculateBarPercentage = (goal, raisedAmount) => {
    const percentage = Math.round((raisedAmount * 100) / goal);

    return percentage;
};

export const checkIfImage = (url, callback) => {
    const img = new Image();
    img.src = url;

    if (img.complete) callback(true);

    img.onload = () => callback(true);
    img.onerror = () => callback(false);
};
