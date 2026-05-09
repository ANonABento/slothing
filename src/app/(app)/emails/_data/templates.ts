import {
  DollarSign,
  Heart,
  HelpCircle,
  Mail,
  MessageCircle,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import type { ElementType } from "react";
import type { EmailTemplateType } from "@/types";

export interface TemplateConfig {
  title: string;
  description: string;
  icon: ElementType;
  color: string;
}

export const TEMPLATE_ORDER: EmailTemplateType[] = [
  "follow_up",
  "thank_you",
  "networking",
  "cold_outreach",
  "status_inquiry",
  "recruiter_reply",
  "negotiation",
  "reference_request",
];

export const TEMPLATE_CONFIG: Record<EmailTemplateType, TemplateConfig> = {
  follow_up: {
    title: "Follow-up Email",
    description: "Check on your application status",
    icon: Mail,
    color: "text-info",
  },
  thank_you: {
    title: "Thank You Email",
    description: "Express gratitude after an interview",
    icon: Heart,
    color: "text-accent",
  },
  networking: {
    title: "Networking Email",
    description: "Connect with professionals at target companies",
    icon: Users,
    color: "text-primary",
  },
  cold_outreach: {
    title: "Cold Outreach",
    description: "Reach out to a hiring manager or engineer",
    icon: UserPlus,
    color: "text-info",
  },
  status_inquiry: {
    title: "Status Inquiry",
    description: "Politely ask about application progress",
    icon: HelpCircle,
    color: "text-amber-500",
  },
  recruiter_reply: {
    title: "Recruiter Reply",
    description: "Respond to inbound recruiter outreach",
    icon: MessageCircle,
    color: "text-primary",
  },
  negotiation: {
    title: "Offer Negotiation",
    description: "Discuss salary and benefits",
    icon: DollarSign,
    color: "text-success",
  },
  reference_request: {
    title: "Reference Request",
    description: "Ask someone to serve as a reference",
    icon: UserCheck,
    color: "text-success",
  },
};

export const SHOW_DUPLICATE_SEND_WARNING = false;
export const DUPLICATE_SEND_WINDOW_DAYS = 14;
