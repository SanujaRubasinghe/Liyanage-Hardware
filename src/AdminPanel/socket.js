import { io } from 'socket.io-client'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const socket = io(API_BASE, {
    query: {
        role: "admin"
    }
})
