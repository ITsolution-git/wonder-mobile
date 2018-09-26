declare module 'react-native-calendar-events' {
  export type RNCalendarEventPermissionLevel = 'denied' | 'restricted' | 'authorized' | 'undetermined';
  export type RNCalendarEventOccurrence = 'daily' | 'weekly' | 'monthly' | 'yearly';

  export default class RNCalendarEvents {
    static authorizeEventStore(): Promise<RNCalendarEventPermissionLevel>;
    static fetchAllEvents(startDate: Date, endDate: Date, calendars: RNCalendarCalendar[]): Promise<any>;
    static findCalendars(): Promise<RNCalendarCalendar[]>;
  }

  export interface RNCalendarEvent {
    id: string;
    calendarId: string;
    title: string;
    startDate: Date;
    endDate: Date;
    allDay: boolean;
    url: string; // iOS only
    location: string;
    description: string; // Android only
    recurrence?: RNCalendarEventOccurrence;
  }

  export interface RNCalendarCalendar { }
}
