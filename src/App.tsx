import "./App.css";
import UpdateForm from "./components/product-form";
import { useEffect } from "react";
import { auth } from "../src/components/firebase/config";
import { signInAnonymously } from "firebase/auth";
import toast from "react-hot-toast";

function App() {
  useEffect(() => {
    signInAnonymously(auth)
      .then(() => {
        toast.success("Signed in anonymously", {id: "anon-signin"});
      })
      .catch((error) => {
        toast.error(`Error signing in anonymously:${error}`,{id: "anon-signin-error"});
      });
  }, []);

  return (
    <>
      <UpdateForm />
    </>
  );
}

export default App;
