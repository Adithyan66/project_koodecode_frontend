import type { ProblemData, SampleTestCase } from "./problem";


export interface Room {
  id: string;
  roomNumber: number;
  roomId: string;
  name: string;
  description: string;
  thumbnail?: string;
  createdBy: string;
  creatorName: string;
  isPrivate: boolean;
  scheduledTime?: Date;
  problemNumber?: number;
  problem?: ProblemData;
  sampleTestCases?: SampleTestCase;
  status: 'waiting' | 'active' | 'inactive';
  participants: Participant[];
  userPermissions: UserPermissions;
  jitsiUrl: string;
  socketToken: string;
  createdAt: Date;
}

export interface Participant {
  userId: string;
  username: string;
  joinedAt: Date;
  isOnline: boolean;
  permissions: UserPermissions;
}

export interface UserPermissions {
  canEditCode: boolean;
  canDrawWhiteboard: boolean;
  canChangeProblem: boolean;
}

export interface RoomListItem {
  id: string;
  roomNumber: number;
  roomId: string;
  name: string;
  description: string;
  thumbnail?: string;
  creatorName: string;
  participantCount: number;
  isActive: boolean;
  problemTitle?: string;
  createdAt: Date;
}

export interface CreateRoomRequest {
  name: string;
  description: string;
  isPrivate: boolean;
  password?: string;
  scheduledTime?: string;
  problemNumber?: number;
  thumbnail?: string;
}

export interface JoinRoomRequest {
  roomId: string;
  password?: string;
}

export interface UpdatePermissionsRequest {
  userId: string;
  permissions: UserPermissions;
}

export interface SocketEvents {
  'problem-changed': (data: { problem: any; code: string; language: string; changedBy: string }) => void;
  'code-changed': (data: { code: string; language: string; changedBy: string }) => void;
  'whiteboard-changed': (data: any) => void;
  'permissions-updated': (data: { targetUserId: string; permissions: UserPermissions; updatedBy: string }) => void;
  'user-joined': (data: { userId: string; username: string }) => void;
  'user-left': (data: { userId: string }) => void;
  'user-kicked': (data: { targetUserId: string; reason?: string; kickedBy: string }) => void;
  'kicked': (data: { reason?: string }) => void;
  'error': (data: { message: string }) => void;
  "test-response":any
  "message-received":any
  "user-typing":any
}
