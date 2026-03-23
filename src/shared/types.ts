import { Equipment } from '_tosslib/server/types';

export interface BookingFormValues {
  roomId: string | null;
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: Equipment[];
  floor: string;
}
