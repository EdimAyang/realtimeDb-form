/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { realtimeDB } from "../firebase/config";
import { ref, set, push, onValue } from "firebase/database";


//listening to realtime update on products
export const listenToProducts = (
  ProductId: string,
  callback: (data: any) => void
) => {
  const productsRef = ref(realtimeDB, `products/${ProductId}`);

  const unsubscribe = onValue(productsRef, (snapshot) => {
    callback(snapshot.val());
  });

  return unsubscribe;
};

const createUpdate = async (payload: any) => {
  const productsRef = ref(realtimeDB, "products");
  const newProductRef = push(productsRef);
  await set(newProductRef, payload);
  return newProductRef.key;
};

export const useCreateProduct = () => {
  return useMutation({
    mutationKey: ["updateProduct"],
    mutationFn: createUpdate,
  });
};
