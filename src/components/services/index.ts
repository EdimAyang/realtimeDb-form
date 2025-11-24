/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { realtimeDB } from "../firebase/config";
import { ref, set, push, onValue } from "firebase/database";
import toast, {
  type Renderable,
  type Toast,
  type ValueFunction,
} from "react-hot-toast";



//listening to realtime update on products
export const listenToProducts = (
  ProductId: string,
  callback: (data: any) => void
) => {
  const productsRef = ref(realtimeDB, `products/${ProductId}`);
  const unsubscribe = onValue(productsRef, (snapshot) => {
    callback(snapshot.val()),
      (error: { messagee: Renderable | ValueFunction<Renderable, Toast> }) => {
        toast.error(error.messagee);
      };
  });

  return unsubscribe;
};

const createUpdate = async (payload: any): Promise<string> => {
  try {
    const productsRef = ref(realtimeDB, "products");
    const newProductRef = push(productsRef);
    await set(newProductRef, payload);
    return newProductRef.key
  } catch (error: any) {
     // Detect Firebase network errors
    if (error?.code === "auth/network-request-failed" ||
        error?.message?.includes("network")) {
          console.error(error)
      throw new Error("Network error. Please check your internet connection.");
    }

    throw error; // fallback
  }
};

export const useCreateProduct = () => {
  return useMutation({
    mutationKey: ["updateProduct"],
    mutationFn: createUpdate,
  });
};
