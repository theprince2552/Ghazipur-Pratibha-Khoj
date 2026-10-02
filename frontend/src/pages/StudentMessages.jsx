import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  MessageSquare,
  CheckCircle2,
  MailOpen,
  Loader2,
} from "lucide-react";

import api from "../api/axios";

function StudentMessages() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readingId, setReadingId] = useState(null);

  // ==========================================
  // FETCH MESSAGES
  // ==========================================

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const response = await api.get("/messages/student/");

      if (response.data?.success) {
        setMessages(response.data.data || []);
      } else {
        toast.error("Unable to load messages.");
      }
    } catch (error) {
      console.error("MESSAGES ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load messages."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ==========================================
  // MARK AS READ
  // ==========================================

  const markAsRead = async (messageId) => {
    try {
      setReadingId(messageId);

      await api.patch(
        `/messages/student/${messageId}/read/`
      );

      setMessages((prev) =>
        prev.map((item) =>
          item.id === messageId
            ? {
                ...item,
                is_read: true,
              }
            : item
        )
      );
    } catch (error) {
      console.error("MARK READ ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to mark message as read."
      );
    } finally {
      setReadingId(null);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const unreadCount = messages.filter(
    (message) => !message.is_read
  ).length;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto" />

          <p className="mt-5 text-gray-400">
            Loading messages...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-[#020617] text-white px-4 sm:px-6 lg:px-8 py-8">

      <div className="max-w-5xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div className="flex items-center gap-4">

            <button
              onClick={() => navigate("/dashboard")}
              className="p-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <div className="flex items-center gap-3">

                <MessageSquare
                  size={24}
                  className="text-cyan-400"
                />

                <h1 className="text-2xl sm:text-3xl font-black">
                  Messages
                </h1>

              </div>

              <p className="mt-1 text-sm text-gray-400">
                Messages and updates from Ghazipur Pratibha Khoj
              </p>
            </div>

          </div>

          {/* UNREAD COUNT */}

          <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">

            <MailOpen size={17} />

            {unreadCount} unread

          </div>

        </div>


        {/* ================= EMPTY STATE ================= */}

        {messages.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
              <MessageSquare size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              No messages yet
            </h2>

            <p className="mt-2 text-gray-400">
              You don't have any messages from the admin.
            </p>

          </div>
        ) : (

          /* ================= MESSAGE LIST ================= */

          <div className="space-y-4">

            {messages.map((message) => (

              <div
                key={message.id}
                className={`rounded-3xl border p-5 sm:p-6 transition ${
                  message.is_read
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-cyan-400/30 bg-cyan-400/[0.06] shadow-lg shadow-cyan-950/20"
                }`}
              >

                {/* TOP */}

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                  <div className="flex items-start gap-3">

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        message.is_read
                          ? "bg-white/5 text-gray-400"
                          : "bg-cyan-400/10 text-cyan-400"
                      }`}
                    >
                      <MessageSquare size={20} />
                    </div>

                    <div>

                      <div className="flex items-center gap-2">

                        <h2 className="font-bold text-white">
                          Message from Admin
                        </h2>

                        {!message.is_read && (
                          <span className="rounded-full bg-cyan-400 px-2 py-0.5 text-[10px] font-bold text-slate-950">
                            NEW
                          </span>
                        )}

                      </div>

                      <p className="mt-1 text-xs text-gray-500">
                        {formatDate(message.created_at)}
                      </p>

                    </div>

                  </div>


                  {/* READ STATUS */}

                  {message.is_read && (
                    <div className="flex items-center gap-1.5 text-xs text-green-400">
                      <CheckCircle2 size={15} />
                      Read
                    </div>
                  )}

                </div>


                {/* MESSAGE */}

                <div className="mt-5 rounded-2xl border border-white/5 bg-black/20 p-4 sm:p-5">

                  <p className="whitespace-pre-wrap text-sm sm:text-base leading-7 text-gray-200">
                    {message.message}
                  </p>

                </div>


                {/* ACTION */}

                {!message.is_read && (
                  <div className="mt-4 flex justify-end">

                    <button
                      onClick={() => markAsRead(message.id)}
                      disabled={readingId === message.id}
                      className="flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/20 disabled:opacity-50"
                    >

                      {readingId === message.id ? (
                        <>
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                          Marking...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          Mark as Read
                        </>
                      )}

                    </button>

                  </div>
                )}

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default StudentMessages;