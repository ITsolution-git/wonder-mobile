import User from "./user";
import Topic from "./topic";

export interface AppoinmentUser extends Partial<User> {
  first_name: string;
  last_name: string;
  location?: string;
}

export default interface Appointment {
  name: string; // Activity name
  location: string;
  latitude?: number;
  longitude?: number;
  event_at: Date;
  topic: Topic;
  owner: AppoinmentUser;
  users: AppoinmentUser[];
  demerits?: string[];

  state: 'created' | 'negotiating' | 'confirmed' | 'cancelled';
  invited_at: Date;
  confirmed_at: Date;
}

export interface DecoratedAppointment extends Appointment {
  me: AppoinmentUser;
  match: AppoinmentUser;
}

// POST body for the Create Appointment
export interface AppointmentPayload {
  invited_user_id?: number | null;
  appointment?: {
    name?: string | null;
    location?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    event_at?: string | null;
    topic_id?: number | null;
  };
}
