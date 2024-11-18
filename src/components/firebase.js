import { app, db, auth, storage, analytics } from "./firebase/Base.js";
import { login, signup, logout } from "./firebase/SignIn.js";
import {
  addStorage,
  updateStorage,
  deleteStorage,
  getStorages,
} from "./firebase/Storage.js";
import {
  AddMaterial,
  UpdateMaterial,
  GetMaterialById,
  DeleteMaterial,
  getMaterials,
  getMaterial,
} from "./firebase/Material.js";
import {
  AddReservation,
  GetReservations,
  UpdateReservation,
  DeleteReservation,
} from "./firebase/MaterialReservations.js";
import { uploadImage, DeleteImage } from "./firebase/firebaseStorage.js";
import { ToggleFavorite } from "./firebase/user.js";

export {
  app,
  db,
  auth,
  storage,
  analytics,
  login,
  signup,
  logout,
  AddMaterial,
  UpdateMaterial,
  DeleteMaterial,
  DeleteImage,
  GetMaterialById,
  ToggleFavorite,
  uploadImage,
  addStorage,
  updateStorage,
  deleteStorage,
  getStorages,
  getMaterial,
  getMaterials,
  AddReservation,
  GetReservations,
  UpdateReservation,
  DeleteReservation,
};
