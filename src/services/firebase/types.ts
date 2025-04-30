
import { Timestamp } from "firebase/firestore";

// Interface pour les suggestions de radio
export interface RadioSuggestion {
  radioName: string;
  streamUrl: string;
  websiteUrl?: string;
  logoUrl?: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  senderEmail: string;
  country: string;
  tags: string;
  language: string;
  sponsored: boolean;
  createdAt: Date | Timestamp;
}

// Interface for the approved radios to display
export interface ApprovedRadio {
  id: string;
  radioName: string;
  streamUrl: string;
  websiteUrl?: string;
  logoUrl?: string;
  description: string;
  approvedAt: Date;
  country: string;
  tags: string;
  language: string;
}
