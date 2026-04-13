import { useState, useEffect } from "react";
import api from "../api/axios";

// const SubscribeButton = ({ channelId, setVideo }) => {
//   const [subscribed, setSubscribed] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchStatus = async () => {
//       try {
//         const res = await api.get(`/subscriptions/c/${channelId}`);
//         setSubscribed(res.data.data.subscribed);
//       } catch (err) {
//         console.error("Fetch subscription error:", err);
//       }
//     };

//     if (channelId) fetchStatus();
//   }, [channelId]);

//   const toggleSubscription = async () => {
//     if (loading) return;

//     const prev = subscribed;

//     setSubscribed(!subscribed);

//     try {
//       setLoading(true);

//       const res = await api.post(
//         `/subscriptions/c/${channelId}`
//       );

//       setSubscribed(res.data.data.subscribed);

//     } catch (err) {
//       setSubscribed(prev);
//       if (err.response?.status === 401) {
//         window.location.href = "/login";
//         return;
//       }
//       console.error("Subscription error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

const SubscribeButton = ({ channelId, setVideo }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get(`/subscriptions/c/${channelId}`);
        setSubscribed(res.data.data.subscribed);
      } catch (err) {
        console.error("Fetch subscription error:", err);
      }
    };
    
    if (channelId) fetchStatus();
  }, [channelId]);
  
  const toggleSubscription = async () => {
    if (loading) return;
    const prev = subscribed;
    setSubscribed(!subscribed);
    try {
      setLoading(true);
      const res = await api.post(`/subscriptions/c/${channelId}`);
      setSubscribed(res.data.data.subscribed);
      if (setVideo) {
        setVideo(prev => ({
          ...prev,
          owner: {
            ...prev.owner,
            subscribersCount: prev.owner.subscribersCount + (res.data.data.subscribed ? 1 : -1)
          }
        }));
      }
    } catch (err) {
      setSubscribed(prev);
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
      className={`px-5 py-2 rounded-full font-semibold transition ${
        subscribed
          ? "bg-gray-700"
          : "bg-red-600 hover:bg-red-700"
      } ${loading ? "opacity-50" : ""}`}
    >
      {subscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
};

export default SubscribeButton;