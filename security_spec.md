# Security Specification - Remarket BD

## 1. Data Invariants
- An `Item` must have a valid `ownerId` that matches the creator's UID.
- A `Booking` must reference an existing `itemId` and the `ownerId` must match that item's owner.
- A `ChatThread` must include the current user in `participantIds`.
- A `Message` must belong to a thread where the sender is a participant.
- `price` and `rating` must be non-negative.
- `status` for bookings must follow the defined enum.

## 2. The "Dirty Dozen" Payloads (Deny cases)
1. Creating an item with someone else's UID as `ownerId`.
2. Updating an item's `price` to a negative number.
3. Updating an item's `ownerId` (immutable).
4. Creating a booking where `renterId` is not the current user.
5. Updating a booking status to a value not in the enum.
6. Reading another user's private messages without being a participant in the thread.
7. Deleting an item you don't own.
8. Injecting a massive string (1MB+) into the item `description`.
9. Self-assigning `rating` in an item update (only system or others should ideally, but for this demo we'll restrict item update to owners).
10. Creating a message with a spoofed `senderId`.
11. Reading the entire `users` collection without targeting a UID (if we restrict list).
12. Updating someone else's user profile.

## 3. Test Runner (Conceptual)
All the above payloads should return `PERMISSION_DENIED`.
