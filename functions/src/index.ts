import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

interface Invitation {
    eventId: string;
    hostId: string;
    inviteeId: string;
    status: "pending" | "accepted" | "declined";
}

/**
 * Triggered when a new invitation is created using the v2 SDK syntax.
 * This function fetches event and host details to create a rich
 * notification for the invited user.
 */
export const createNotificationOnNewInvitation = onDocumentCreated("invitations/{invitationId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        console.log("No data associated with the event");
        return;
    }

    const invitation = snapshot.data() as Invitation;
    const { eventId, hostId, inviteeId } = invitation;

    try {
        // Get the event details to include the event title in the notification
        const eventDoc = await db.collection("events").doc(eventId).get();
        const eventData = eventDoc.data();

        // Get the host's user profile to include their name
        const hostDoc = await db.collection("users").doc(hostId).get();
        const hostData = hostDoc.data();

        if (!eventData || !hostData) {
            console.error("Event or Host data not found.", { eventId, hostId });
            return;
        }

        // Create the notification document
        const notification = {
            recipientId: inviteeId,
            senderName: hostData.name || "A user",
            type: "invite",
            text: `${hostData.name} has invited you to the event: "${eventData.title}"`,
            relatedEventId: eventId,
            relatedInvitationId: snapshot.id,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            read: false,
        };

        await db.collection("notifications").add(notification);
        console.log(`Notification created for user ${inviteeId} for event ${eventId}`);
    } catch (error) {
        console.error("Error creating notification:", error);
    }
});

