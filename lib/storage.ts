// Simple in-memory storage for rooms and lixi claims
// Note: This will reset on server restart. For production, consider using a database.

interface Room {
  id: string;
  amountMin: number; // in thousands (e.g., 10 = 10,000 VND)
  amountMax: number; // in thousands (e.g., 500 = 500,000 VND)
  createdAt: number;
}

interface LixiClaim {
  roomId: string;
  accountId: string;
  amount: number; // in VND
  claimedAt: number;
}

// In-memory storage
const rooms = new Map<string, Room>();
const claims = new Map<string, LixiClaim>(); // key: `${roomId}:${accountId}`

// Generate MongoDB-like ObjectId (24 hex characters)
function generateObjectId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const randomPart = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
  return timestamp + randomPart;
}

// Generate random amount within range (in VND)
function generateRandomAmount(min: number, max: number): number {
  // Convert from thousands to VND
  const minVND = min * 1000;
  const maxVND = max * 1000;
  // Round to nearest 1000
  const random = Math.floor(Math.random() * (maxVND - minVND + 1)) + minVND;
  return Math.floor(random / 1000) * 1000;
}

export const storage = {
  // Room operations
  createRoom(amountMin: number, amountMax: number): string {
    const id = generateObjectId();
    rooms.set(id, {
      id,
      amountMin,
      amountMax,
      createdAt: Date.now(),
    });
    return id;
  },

  getRoom(id: string): Room | undefined {
    return rooms.get(id);
  },

  // Lixi operations
  claimLixi(roomId: string, accountId: string): { money: number } | null {
    const room = rooms.get(roomId);
    if (!room) {
      return null;
    }

    const claimKey = `${roomId}:${accountId}`;
    
    // Check if already claimed
    if (claims.has(claimKey)) {
      const existingClaim = claims.get(claimKey)!;
      return { money: existingClaim.amount };
    }

    // Generate new claim
    const amount = generateRandomAmount(room.amountMin, room.amountMax);
    claims.set(claimKey, {
      roomId,
      accountId,
      amount,
      claimedAt: Date.now(),
    });

    return { money: amount };
  },

  // Utility functions
  getAllRooms(): Room[] {
    return Array.from(rooms.values());
  },

  getAllClaims(): LixiClaim[] {
    return Array.from(claims.values());
  },

  // Cleanup old data (optional, for memory management)
  cleanup(maxAge: number = 7 * 24 * 60 * 60 * 1000): void {
    // Remove rooms and claims older than maxAge (default 7 days)
    const now = Date.now();
    for (const [id, room] of rooms.entries()) {
      if (now - room.createdAt > maxAge) {
        rooms.delete(id);
        // Remove related claims
        for (const [key, claim] of claims.entries()) {
          if (claim.roomId === id) {
            claims.delete(key);
          }
        }
      }
    }
  },
};
