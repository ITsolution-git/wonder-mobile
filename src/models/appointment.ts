import User from "./user";
import Topic from "./topic";

export interface AppointmentUser extends Partial<User> {
  id: number;
  first_name: string;
  last_name: string;
  location?: string;
}

export default interface Appointment {
  id: number;
  name: string; // Activity name
  phone: string | null;
  location: string;
  latitude?: number;
  longitude?: number;
  event_at: Date;
  topic: Topic;
  owner: AppointmentUser;
  users: AppointmentUser[];

  state: 'created' | 'negotiating' | 'confirmed' | 'cancelled';
  invited_at: Date;
  confirmed_at: Date;
}

export interface DecoratedAppointment extends Appointment {
  me: AppointmentUser;
  match: AppointmentUser;
}

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
