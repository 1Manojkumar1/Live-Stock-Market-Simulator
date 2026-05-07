import { useState, useEffect } from "react";
import api from "../../services/api";

const SystemConfig = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const res = await api.get("/transactions");

      // backend response:
      // { message, count, transactions }

      setTransactions(res.data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions;
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading transactions...
      </div>
    );
  }

  return (
    <div className="system-config-panel p-6">
      <h2 className="text-2xl font-bold mb-4">
        All Transactions
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">User</th>
              <th className="border p-3">Email</th>
              <th className="border p-3">Stock</th>
              <th className="border p-3">Symbol</th>
              <th className="border p-3">Type</th>
              <th className="border p-3">Quantity</th>
              <th className="border p-3">Price</th>
              <th className="border p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transid) => (
                <tr key={transid._id} className="text-center">
                  <td className="border p-3">
                    {transid.userId?.name}
                  </td>

                  <td className="border p-3">
                    {transid.userId?.email}
                  </td>

                  <td className="border p-3">
                    {transid.stockId?.stockName}
                  </td>

                  <td className="border p-3">
                    {transid.stockId?.symbol}
                  </td>

                  <td className="border p-3">
                    <span
                      className={`font-semibold ${
                        transid.type === "BUY"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {transid.type}
                    </span>
                  </td>

                  <td className="border p-3">
                    {transid.quantity}
                  </td>

                  <td className="border p-3">
                    ₹{transid.price}
                  </td>

                  <td className="border p-3">
                    {new Date(
                      transid.createdAt
                    ).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="border p-4 text-center"
                >
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SystemConfig;