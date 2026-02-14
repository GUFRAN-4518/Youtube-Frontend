import { useState } from "react";
import api from "../api/axios";

const SubscribeButton = ({ channelId }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleSubscription = async () => {
    try {
      setLoading(true);

      const res = await api.post(
        `/subscriptions/toggle/${channelId}`
      );

      setSubscribed(res.data.data.subscribed);

    } catch (err) {
      console.error("Subscription error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleSubscription}
      disabled={loading}
      className={`px-5 py-2 rounded-full font-semibold transition ${
        subscribed
          ? "bg-gray-700"
          : "bg-red-600 hover:bg-red-700"
      }`}
    >
      {subscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
};

export default SubscribeButton;