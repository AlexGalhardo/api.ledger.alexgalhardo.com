"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DateTime {
    static timestampToGetNow(timestamp) {
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
    static isToday(dateLastAPIRequest) {
        return new Date().getDate() === dateLastAPIRequest.getDate();
    }
    static isExpired(dateToCheck) {
        return dateToCheck <= new Date();
    }
    static secondsToMilliseconds(seconds) {
        return seconds * 1000;
    }
    static minutesToMilliseconds(minutes) {
        return minutes * 60000;
    }
    static hoursToMilliseconds(hours) {
        return hours * 3600000;
    }
    static daysToMilliseconds(days) {
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
exports.default = DateTime;
//# sourceMappingURL=date-time.util.js.map