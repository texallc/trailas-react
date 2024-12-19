import { auth } from "..";
import { User, createUserWithEmailAndPassword, onIdTokenChanged, signInWithEmailAndPassword } from "firebase/auth";

export const createUserWithEmail = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);

export const signInWithEmail = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);

export const getCurrentUser = () => new Promise<User>((resolve, reject) => {
  const uns = onIdTokenChanged(
    auth,
    (user) => {
      uns();

      if (!user) {
        reject("Error de autenticación");
        return;
      }

      resolve(user);
    },
    () => reject("Error de autenticación")
  );
});

export const getCurrentToken = () => new Promise<string>((resolve, reject) => {
  const uns = onIdTokenChanged(
    auth,
    async (user) => {
      uns();

      if (!user) {
        reject("Error de autenticación.");
        return;
      }

      const token = await user.getIdToken();

      resolve(token);
    },
    (error) => {
      console.log(error);
      reject("Error de autenticación.");
    }
  );
});
