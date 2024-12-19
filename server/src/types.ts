export interface room {
  roomId: string,
  isAvailable: boolean,
  p1: {
    id: string | null,
  },
  p2: {
    id: string | null
  }
}
