import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
} from "firebase/auth";

import firebaseConfig from "../../constants/firebaseConfig";
import UnimplementedError from "../utils/UnimplementedError";

/**
 * Service class for handling authentication-related operations using Firebase.
 *
 * @class
 */
class AuthService {
  /**
   * Constructor to initialize Firebase app and authentication instance.
   *
   * @constructor
   */
  constructor() {
    this.firebaseApp = initializeApp(firebaseConfig);
    this.auth = getAuth(this.firebaseApp);
  }

  /**
   * Register a new user with the provided email and password.
   *
   * @param {string} email - The email of the user.
   * @param {string} password - The password for the new user.
   * @returns {Promise<UserCredential>} - A promise that resolves with the user credential after successful registration.
   * @throws {Error} - Throws an error if registration fails.
   */
  async register(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      // Send email verification after successful registration
      await sendEmailVerification(userCredential.user);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Log out the current user.
   *
   * @returns {Promise<void>} - A promise that resolves after successful logout.
   * @throws {Error} - Throws an error if logout fails.
   */
  async logout() {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Log in a user with the provided email and password.
   *
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<User>} - A promise that resolves with the user information after successful login.
   * @throws {Error} - Throws an error if login fails or if the email is not verified.
   */
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      // Check if the user's email is verified
      if (userCredential.user.emailVerified) {
        return userCredential.user;
      } else {
        await this.logout(); // Log out if email is not verified
        throw new Error("Email not verified");
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Send email verification to the current user.
   *
   * @returns {Promise<void>} - A promise that resolves after the email verification is sent.
   * @throws {Error} - Throws an error if sending email verification fails.
   */
  async sendEmailVerification() {
    try {
      const user = this.auth.currentUser;
      await sendEmailVerification(user);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Send a password reset email to the specified email address.
   *
   * @param {string} email - The email address for the password reset.
   * @returns {Promise<void>} - A promise that resolves after the password reset email is sent.
   * @throws {Error} - Throws an error if sending password reset email fails.
   */
  async forgotPassword(email) {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Unimplemented method for signing in with Google.
   *
   * @param {string} provider - The Google provider.
   * @throws {Error} - Throws an error indicating that the feature is not yet implemented.
   */
  async signInWithGoogle(provider) {
    UnimplementedError(provider);
  }

  /**
   * Unimplemented method for signing in with Facebook.
   *
   * @param {string} provider - The Facebook provider.
   * @throws {Error} - Throws an error indicating that the feature is not yet implemented.
   */
  async signInWithFacebook(provider) {
    UnimplementedError(provider);
  }
}

// Export the AuthService class for use in other parts of the application
export default AuthService;
