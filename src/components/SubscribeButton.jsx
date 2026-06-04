import { useState, useEffect } from "react";
import api from "../api/axios";

const SubscribeButton = ({ channelId, setSubscribersCount }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get(`/subscriptions/c/${channelId}`);
        setSubscribed(res.data.data.subscribed);
        if (setSubscribersCount && res.data.data.subscribersCount !== undefined) {
          setSubscribersCount(res.data.data.subscribersCount);
        }
      } catch (err) {
        console.error("Fetch subscription error:", err);
      }
    };
    
    if (channelId) fetchStatus();
  }, [channelId, setSubscribersCount]);
  
  const toggleSubscription = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await api.post(`/subscriptions/c/${channelId}`);
      setSubscribed(res.data.data.subscribed);
      
      if (setSubscribersCount && res.data.data.subscribersCount !== undefined) {
        setSubscribersCount(res.data.data.subscribersCount);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        window.location.href = "/login";
        return;
      }
      console.error("Subscription error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <button
      onClick={toggleSubscription}
      disabled={loading}
      className={`px-5 py-2.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 active:scale-95 ${
        subscribed
          ? "bg-white/10 text-white hover:bg-white/20 border border-white/10"
          : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {subscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
};

export default SubscribeButton;