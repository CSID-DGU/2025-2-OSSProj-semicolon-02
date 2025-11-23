// src/lib/authSession.ts
export type LoginUser = {
    id: number;
    email: string;
    name: string;
  };
  
  let currentUser: LoginUser | null = null;
  
  export function setCurrentUser(user: LoginUser | null) {
    currentUser = user;
  }
  
  export function getCurrentUser(): LoginUser | null {
    return currentUser;
  }
  