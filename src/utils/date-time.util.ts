export default class DateTime {
    static timestampToGetNow(timestamp: number) {
        const date = new Date(timestamp * 1000).toLocaleDateString(process.env.LOCALE_DATE_TIME);
        const time = new Date(timestamp * 1000).toLocaleTimeString(process.env.LOCALE_DATE_TIME);
        return `${date} ${time}`;
    }

    static getNow() {
        const date = new Date().toLocaleDateString(process.env.LOCALE_DATE_TIME);
        const time = new Date().toLocaleTimeString(process.env.LOCALE_DATE_TIME);
        return `${date} ${time}`;
    }

    static getTimestampNow() {
        return Math.floor(Date.now() / 1000);
    }

    static isToday(dateLastAPIRequest: Date) {
        return new Date().getDate() === dateLastAPIRequest.getDate();
    }

    static isExpired(dateToCheck: Date): boolean {
        return dateToCheck <= new Date();
    }

    static secondsToMilliseconds(seconds: number): number {
        return seconds * 1000;
    }

    static minutesToMilliseconds(minutes: number): number {
        return minutes * 60000;
    }

    static hoursToMilliseconds(hours: number): number {
        return hours * 3600000;
    }

    static daysToMilliseconds(days: number): number {
        return days * 86300000;
    }

    static get secondInMilliseconds() {
        return 1000;
    }

    static get minuteInMilliseconds() {
        return 60000;
    }

    static get hourInMilliseconds() {
        return 3600000;
    }
}
