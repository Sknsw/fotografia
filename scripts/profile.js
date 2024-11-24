import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const uploadForm = document.getElementById("upload-form");
const progressBar = document.getElementById("progress-bar");

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = document.getElementById("file").files[0];
  const title = document.getElementById("title").value;
  const tags = document.getElementById("tags").value.split(",");

  if (!file) return alert("Selecciona un archivo.");
  if (file.size > 50 * 1024 * 1024) return alert("El archivo no puede superar los 50 MB.");

  const isVideo = file.type.startsWith("video/");
  const storageRef = ref(getStorage(), `uploads/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressBar.style.width = `${progress}%`;
    },
    (error) => {
      console.error("Error al subir:", error);
      alert("Error al subir el archivo.");
    },
    async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      const fileType = isVideo ? "video" : "photo";

      await setDoc(doc(db, "files", file.name), {
        type: fileType,
        url: downloadURL,
        uploader: firebase.auth().currentUser.uid,
        title,
        tags,
        uploadDate: new Date(),
        views: 0,
        sales: 0
      });

      alert("Archivo subido exitosamente.");
      progressBar.style.width = "0%";
    }
  );
});