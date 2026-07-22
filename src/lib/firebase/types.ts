export type UserRole = "tenant" | "owner";

export interface UserDoc {
  uid: string;
  name: string;
  email: string;
  phone: string | null;
  roles: UserRole[];
  emailVerified: boolean;
  photoURL: string | null;
  suspended: boolean;
  createdAt: number;
}

export type PropertyType = "house" | "apartment" | "room" | "hostel" | "shop" | "villa" | "penthouse";
export type PropertyStatus = "pending" | "approved" | "rejected" | "suspended";
export type Furnishing = "furnished" | "semi-furnished" | "unfurnished";
export type PreferredFor = "any" | "male" | "female";

export interface PropertyDoc {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  type: PropertyType;
  price: number;
  city: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  furnishing: Furnishing;
  preferredFor: PreferredFor;
  amenities: string[];
  images: string[];
  status: PropertyStatus;
  rejectionReason: string | null;
  featured: boolean;
  ratingAvg: number;
  ratingCount: number;
  createdAt: number;
  tag?: string;
  /** Set by admin when moderating. */
  moderatedBy?: string;
  moderatedAt?: number;
}

export interface FavoriteDoc {
  uid: string;
  propertyId: string;
  createdAt: number;
}

export type InquiryStatus = "sent" | "read" | "replied";

export interface InquiryDoc {
  id: string;
  propertyId: string;
  ownerId: string;
  tenantId: string;
  message: string;
  reply: string | null;
  status: InquiryStatus;
  createdAt: number;
}

export interface ReviewDoc {
  id: string;
  propertyId: string;
  tenantId: string;
  rating: number;
  text: string;
  createdAt: number;
}

export type NotificationType =
  | "new_inquiry"
  | "inquiry_read"
  | "inquiry_replied"
  | "listing_approved"
  | "listing_rejected"
  | "new_review"
  | "booking_confirmed"
  | "booking_cancelled";

export interface NotificationDoc {
  id: string;
  uid: string;
  type: NotificationType;
  payload: Record<string, string>;
  read: boolean;
  createdAt: number;
}

export interface SavedSearchFilters {
  city?: string;
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  furnishing?: Furnishing;
}

export interface SavedSearchDoc {
  id: string;
  uid: string;
  filters: SavedSearchFilters;
  lastNotifiedAt: number | null;
  createdAt: number;
}

// ---------------------------------------------------------------------------
// Messaging
// ---------------------------------------------------------------------------

/** A conversation thread between one owner and one tenant about a property. */
export interface ConversationDoc {
  id: string;
  ownerId: string;
  tenantId: string;
  propertyId: string;
  propertyTitle: string;
  tenantName: string;
  ownerName: string;
  lastMessage: string;
  lastMessageAt: number;
  unreadByOwner: number;
  unreadByTenant: number;
  createdAt: number;
}

/** A single message within a conversation (stored as subcollection). */
export interface MessageDoc {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: "owner" | "tenant";
  text: string;
  createdAt: number;
}

// ---------------------------------------------------------------------------
// Bookings
// ---------------------------------------------------------------------------

export type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface BookingDoc {
  id: string;
  propertyId: string;
  tenantId: string;
  ownerId: string;
  /** Epoch milliseconds */
  startDate: number;
  /** Epoch milliseconds */
  endDate: number;
  status: BookingStatus;
  /** Total amount in cents */
  amount: number;
  paymentIntentId: string | null;
  stripeSessionId: string | null;
  createdAt: number;
}

// ---------------------------------------------------------------------------
// Admin Moderation Log
// ---------------------------------------------------------------------------

export type ModerationAction = "approve" | "reject" | "suspend";

export interface ModerationLogDoc {
  id: string;
  propertyId: string;
  action: ModerationAction;
  adminUid: string;
  adminEmail?: string;
  reason?: string;
  createdAt: number;
}
