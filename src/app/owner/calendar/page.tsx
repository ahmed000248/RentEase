import OwnerCalendarClient from "@/components/owner/OwnerCalendarClient";
import { getCurrentUser } from "@/lib/auth/server";
import { getCalendarEventsForOwner } from "@/lib/data/owner";

export const metadata = {
  title: "Calendar | Owner Portal — RentEase",
  description: "Manage your property schedule including viewings, key handoffs, and maintenance events.",
};

export default async function OwnerCalendarPage() {
  const currentUser = await getCurrentUser();

  const { eventsByDay, todayEvents, upcomingEvents } = currentUser
    ? await getCalendarEventsForOwner(currentUser.uid)
    : { eventsByDay: {}, todayEvents: [], upcomingEvents: [] };

  return (
    <OwnerCalendarClient
      initialEventsByDay={eventsByDay}
      initialTodayEvents={todayEvents}
      initialUpcomingEvents={upcomingEvents}
    />
  );
}
