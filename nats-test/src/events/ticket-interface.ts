import { Subjects } from "./subjects";
export interface Ticket {
    subject: Subjects;
    data: {
      id: string;
      title: string;
      price: number;
      userId: string;
    };
  }