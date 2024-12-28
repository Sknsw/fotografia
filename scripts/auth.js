// auth.js


// Función para registrar un usuario
export const registerUser = async (email, password, role) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Guardar el rol del usuario en Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      role: role,
    });

    console.log(`Usuario registrado con rol: ${role}`);
    return user;
  } catch (error) {
    console.error("Error al registrar usuario:", error.message);
  }
};

// Función para iniciar sesión
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Obtener el rol del usuario
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log(`Usuario logueado: ${userData.role}`);
      return userData.role;
    } else {
      console.error("No se encontró el rol del usuario.");
      return null;
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);
  }
};

// Función para cerrar sesión
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("Usuario cerró sesión");
  } catch (error) {
    console.error("Error al cerrar sesión:", error.message);
  }
};