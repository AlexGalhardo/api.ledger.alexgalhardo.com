export default class DateTime {
    static timestampToGetNow(timestamp: number): string;
    static getNow(): string;
    static getTimestampNow(): number;
    static isToday(dateLastAPIRequest: Date): boolean;
    static isExpired(dateToCheck: Date): boolean;
    static secondsToMilliseconds(seconds: number): number;
    static minutesToMilliseconds(minutes: number): number;
    static hoursToMilliseconds(hours: number): number;
    static daysToMilliseconds(days: number): number;
    static get secondInMilliseconds(): number;
    static get minuteInMilliseconds(): number;
    static get hourInMilliseconds(): number;
}
