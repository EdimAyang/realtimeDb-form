import { useCreateProduct, listenToProducts } from "../services";
import "./style.css";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Data {
  id: string;
  name: string;
  amount: string;
  quantity: string;
}
const UpdateForm = () => {
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [productId, setProductId] = useState<string>("");
  const [data, setData] = useState<Data | null>(null);

  const resetFn = () => {
    setAmount("");
    setQuantity("");
    setName("");
  };
  const updateMutation = useCreateProduct();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      id: Date.now(),
      name: name,
      amount: amount,
      quantity: quantity,
    };

    updateMutation.mutate(payload, {
      onSuccess: (id: string) => {
        setProductId(id);
        resetFn();
        toast.success("Update successfull");
      },
      onError: (error) => {
        toast.error(`${error} || Update failed`);
      },
    });
  };

  useEffect(() => {
    const unsubscribe = listenToProducts(productId, (data) => {
      setData(data);
    });

    return () => unsubscribe(); // removes listener
  }, [productId]);


  const state = data?.id || data?.amount || data?.name || data?.quantity

  return (
    <>
      {state !== undefined ? (
        <div className="Container">
          <header>Product details</header>
          <section>
            <p>Id: {data?.id}</p>
          </section>
          <section>
            <p>Name: {data?.name}</p>
          </section>
          <section>
            <p>Amount: {data?.amount}</p>
          </section>
          <section>
            <p>Quantity: {data?.quantity}</p>
          </section>

          <button
            style={{ backgroundColor: "red" }}
            onClick={() =>
              setData(null)
            }
          >
            close
          </button>
        </div>
      ) : (
        <div className="Container">
          <header>Update product</header>
          <form onSubmit={(e) => handleSubmit(e)}>
            <section>
              <label htmlFor="product name">Product name</label>
              <input
                type="text"
                id="product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
                required
              />
            </section>

            <section>
              <label htmlFor="amount">Amount</label>
              <input
                type="text"
                id="amount"
                value={amount}
                placeholder="Enter Amount"
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </section>

            <section>
              <label htmlFor="quantity">Quantity</label>
              <input
                type="text"
                id="quantity"
                value={quantity}
                placeholder="Enter Quantity"
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </section>

            <button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Loading.." : "Update"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default UpdateForm;
