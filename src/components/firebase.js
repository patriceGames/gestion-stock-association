import { app, db, auth, storage, analytics } from "./firebase/Base.js";
import {
  login,
  signup,
  logout,
  UpdateUserPassword,
} from "./firebase/SignIn.js";
import {
  addStorage,
  updateStorage,
  deleteStorage,
  getStorage,
  getStorages,
} from "./firebase/Storage.js";
import {
  AddMaterial,
  UpdateMaterial,
  UpdateMaterialProperty,
  GetMaterialById,
  DeleteMaterial,
  getMaterials,
  getMaterial,
} from "./firebase/Material.js";
import {
  AddReservation,
  GetAllReservations,
  GetReservations,
  GetUserReservations,
  UpdateReservation,
  DeleteReservation,
} from "./firebase/MaterialReservations.js";
import { uploadImage, DeleteImage } from "./firebase/firebaseStorage.js";
import {
  GetUserData,
  GetCompanyData,
  UpdateUserProfile,
  ToggleFavorite,
  GetAllFavorites,
  GetUserAlarms,
} from "./firebase/user.js";
import {
  AddEmployee,
  GetEmployees,
  ChangeEmployeeRole,
  DeleteEmployee,
} from "./firebase/Roles.js";

export {
  app,
  db,
  auth,
  storage,
  analytics,
  login,
  signup,
  logout,
  UpdateUserPassword,
  AddMaterial,
  UpdateMaterial,
  UpdateMaterialProperty,
  DeleteMaterial,
  DeleteImage,
  GetMaterialById,
  GetUserData,
  GetCompanyData,
  UpdateUserProfile,
  ToggleFavorite,
  GetAllFavorites,
  GetUserAlarms,
  uploadImage,
  addStorage,
  updateStorage,
  deleteStorage,
  getStorage,
  getStorages,
  getMaterial,
  getMaterials,
  AddReservation,
  GetAllReservations,
  GetReservations,
  GetUserReservations,
  UpdateReservation,
  DeleteReservation,
  AddEmployee,
  GetEmployees,
  ChangeEmployeeRole,
  DeleteEmployee,
};
