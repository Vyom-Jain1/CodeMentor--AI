class CollaborationService {
  constructor(io) {
    this.io = io;
    this.activeRooms = new Map();
    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.io.on("connection", (socket) => {
      // Join collaboration room
      socket.on("join-room", (data) => {
        const { roomId, userId, problemId } = data;
        socket.join(roomId);
        if (!this.activeRooms.has(roomId)) {
          this.activeRooms.set(roomId, {
            participants: new Set(),
            problemId,
            code: "",
            language: "javascript",
            cursor: {},
            createdAt: new Date(),
          });
        }
        const room = this.activeRooms.get(roomId);
        room.participants.add({ socketId: socket.id, userId });
        socket.emit("room-state", {
          code: room.code,
          language: room.language,
          participants: Array.from(room.participants),
        });
        socket.to(roomId).emit("user-joined", { userId });
      });

      // Real-time code synchronization
      socket.on("code-change", (data) => {
        const { roomId, code, changes } = data;
        if (this.activeRooms.has(roomId)) {
          this.activeRooms.get(roomId).code = code;
          socket.to(roomId).emit("code-update", { code, changes });
        }
      });

      // Cursor position sharing
      socket.on("cursor-move", (data) => {
        const { roomId, position, userId } = data;
        socket.to(roomId).emit("cursor-update", { position, userId });
      });

      // Voice chat (WebRTC signaling)
      socket.on("voice-offer", (data) => {
        socket.to(data.roomId).emit("voice-offer", {
          offer: data.offer,
          from: socket.id,
        });
      });
      socket.on("voice-answer", (data) => {
        socket.to(data.to).emit("voice-answer", {
          answer: data.answer,
          from: socket.id,
        });
      });

      // AI assistance requests
      // (Assume AIService is required and available)
      // socket.on('request-hint', async (data) => {
      //   const { roomId, problemId, currentCode } = data;
      //   const hint = await AIService.generateHint(problemId, currentCode);
      //   this.io.to(roomId).emit('ai-hint', { hint, requestedBy: socket.id });
      // });

      // Disconnect handling
      socket.on("disconnect", () => {
        this.activeRooms.forEach((room, roomId) => {
          room.participants = new Set(
            Array.from(room.participants).filter(
              (p) => p.socketId !== socket.id
            )
          );
          if (room.participants.size === 0) {
            this.activeRooms.delete(roomId);
          } else {
            socket.to(roomId).emit("user-left", { socketId: socket.id });
          }
        });
      });
    });
  }

  // Create a new collaboration room
  async createRoom(userId, problemId) {
    const roomId = this.generateRoomId();
    const room = {
      id: roomId,
      createdBy: userId,
      problemId,
      participants: [],
      maxParticipants: 4,
      isPublic: false,
      createdAt: new Date(),
    };
    // Save to database if needed
    // await CollaborationRoom.create(room);
    return roomId;
  }

  generateRoomId() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}

module.exports = CollaborationService;
