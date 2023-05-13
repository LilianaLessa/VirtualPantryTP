import { User } from "firebase/auth";

export default class AuthGuardService {
  private readonly user: User | null;

  constructor(user: User | null) {
    this.user = user;
  }

  public guard(
    authenticatedCallback?: () => any,
    notAuthenticatedCallback?: () => any
  ): any {
    const callback =
      typeof this.user?.uid === "undefined"
        ? notAuthenticatedCallback
        : authenticatedCallback;

    return callback ? callback() : undefined;
  }

  public getAuthUserUid(): string {
    if (typeof this.user?.uid === "undefined") {
      throw new Error("Authentication not initialized.");
    }

    return this.user.uid;
  }
}
