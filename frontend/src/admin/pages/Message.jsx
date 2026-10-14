import { useEffect, useMemo, useState } from "react";
import {
  Mail,
  MailOpen,
  Search,
  RefreshCw,
  Trash2,
  X,
  Eye,
  Inbox,
  CheckCircle2,
  AlertCircle,
  Clock3,
  UserRound,
  CalendarDays,
  AtSign,
  MessageSquareText,
  LoaderCircle,
  ExternalLink,
} from "lucide-react";

import api from "../../services/api";
import "./Messages.css";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [markingReadId, setMarkingReadId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/messages");
      const data = response.data?.data;

      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Messages Error:", err);

      setError(
        err.response?.data?.message ||
          "Messages load nahi ho paaye."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const unreadCount = messages.filter(
    (message) => !message.isRead
  ).length;

  const readCount = messages.length - unreadCount;

  const filteredMessages = useMemo(() => {
    const query = search.trim().toLowerCase();

    return messages.filter((message) => {
      const matchesSearch = [
        message.name,
        message.email,
        message.subject,
        message.message,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "read" && message.isRead) ||
        (statusFilter === "unread" && !message.isRead);

      return matchesSearch && matchesStatus;
    });
  }, [messages, search, statusFilter]);

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleOpenMessage = async (message) => {
    setSelectedMessage(message);
    setError("");
    setSuccess("");

    if (message.isRead) return;

    // Optimistic update: UI immediately shows Read.
    setMessages((previous) =>
      previous.map((item) =>
        item._id === message._id
          ? { ...item, isRead: true }
          : item
      )
    );

    setSelectedMessage((previous) =>
      previous?._id === message._id
        ? { ...previous, isRead: true }
        : previous
    );

    try {
      setMarkingReadId(message._id);

      const response = await api.patch(
        `/messages/${message._id}/read`,
        { isRead: true }
      );

      const updatedMessage = response.data?.data;

      if (updatedMessage) {
        setMessages((previous) =>
          previous.map((item) =>
            item._id === message._id
              ? updatedMessage
              : item
          )
        );

        setSelectedMessage((previous) =>
          previous?._id === message._id
            ? updatedMessage
            : previous
        );
      }
    } catch (err) {
      console.error("Mark Message Read Error:", err);

      // Restore the previous state if the API fails.
      setMessages((previous) =>
        previous.map((item) =>
          item._id === message._id
            ? { ...item, isRead: false }
            : item
        )
      );

      setSelectedMessage((previous) =>
        previous?._id === message._id
          ? { ...previous, isRead: false }
          : previous
      );

      setError(
        err.response?.data?.message ||
          "Message ko Read mark nahi kar paaye."
      );
    } finally {
      setMarkingReadId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const id = deleteTarget._id;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await api.delete(`/messages/${id}`);

      setMessages((previous) =>
        previous.filter((message) => message._id !== id)
      );

      setSelectedMessage((previous) =>
        previous?._id === id ? null : previous
      );

      setDeleteTarget(null);
      setSuccess("Message deleted successfully.");
    } catch (err) {
      console.error("Delete Message Error:", err);

      setError(
        err.response?.data?.message ||
          "Message delete nahi ho paaya."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const closeDetails = () => {
    if (!markingReadId) {
      setSelectedMessage(null);
    }
  };

  return (
    <section className="messages-page">
      {/* Page header */}
      <header className="messages-page-header">
        <div className="messages-heading">
          <div className="messages-heading-icon">
            <Mail size={26} />
          </div>

          <div>
            <div className="messages-eyebrow">
              <Inbox size={13} />
              PORTFOLIO MANAGEMENT
            </div>

            <h1>Contact Messages</h1>

            <p>
              Manage enquiries and messages received through your portfolio.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="messages-refresh-btn"
          onClick={fetchMessages}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? "messages-spin" : ""}
          />
          <span>{loading ? "Refreshing..." : "Refresh"}</span>
        </button>
      </header>

      {/* Summary cards */}
      <div className="messages-stats-grid">
        <article className="messages-stat-card">
          <div className="messages-stat-top">
            <span>Total Messages</span>
            <div className="messages-stat-icon messages-stat-purple">
              <Inbox size={19} />
            </div>
          </div>

          <strong>{messages.length.toLocaleString()}</strong>
          <p>All contact enquiries</p>
        </article>

        <article className="messages-stat-card">
          <div className="messages-stat-top">
            <span>Unread Messages</span>
            <div className="messages-stat-icon messages-stat-blue">
              <Mail size={19} />
            </div>
          </div>

          <strong>{unreadCount.toLocaleString()}</strong>
          <p>Waiting to be reviewed</p>
        </article>

        <article className="messages-stat-card">
          <div className="messages-stat-top">
            <span>Read Messages</span>
            <div className="messages-stat-icon messages-stat-green">
              <MailOpen size={19} />
            </div>
          </div>

          <strong>{readCount.toLocaleString()}</strong>
          <p>Messages already reviewed</p>
        </article>
      </div>

      {/* Alerts */}
      {error && (
        <div
          className="messages-alert messages-alert-error"
          role="alert"
        >
          <AlertCircle size={18} />
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div
          className="messages-alert messages-alert-success"
          role="status"
        >
          <CheckCircle2 size={18} />
          <span>{success}</span>

          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Dismiss success message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main panel */}
      <div className="messages-panel">
        <div className="messages-panel-header">
          <div>
            <h2>Your Inbox</h2>
            <p>
              {loading
                ? "Fetching messages..."
                : `${filteredMessages.length} of ${messages.length} messages`}
            </p>
          </div>

          <div className="messages-inbox-indicator">
            <span className="messages-live-dot" />
            Inbox
          </div>
        </div>

        {/* Search and filters */}
        <div className="messages-toolbar">
          <div className="messages-search-box">
            <Search size={17} />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, subject or message..."
              aria-label="Search messages"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="messages-filter-group">
            {[
              { value: "all", label: "All", count: messages.length },
              { value: "unread", label: "Unread", count: unreadCount },
              { value: "read", label: "Read", count: readCount },
            ].map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`messages-filter-btn ${
                  statusFilter === filter.value
                    ? "active"
                    : ""
                }`}
                onClick={() => setStatusFilter(filter.value)}
                aria-pressed={statusFilter === filter.value}
              >
                {filter.label}
                <span>{filter.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Message list */}
        {loading ? (
          <div className="messages-state">
            <div className="messages-state-icon">
              <LoaderCircle size={28} className="messages-spin" />
            </div>
            <h3>Loading your inbox</h3>
            <p>Please wait while we fetch your messages.</p>
          </div>
        ) : error && messages.length === 0 ? (
          <div className="messages-state">
            <div className="messages-state-icon messages-state-error">
              <AlertCircle size={27} />
            </div>
            <h3>Unable to load messages</h3>
            <p>Check your connection and try again.</p>
            <button
              type="button"
              className="messages-secondary-btn"
              onClick={fetchMessages}
            >
              <RefreshCw size={15} />
              Try Again
            </button>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="messages-state">
            <div className="messages-state-icon">
              {search || statusFilter !== "all" ? (
                <Search size={27} />
              ) : (
                <Inbox size={27} />
              )}
            </div>

            <h3>
              {search || statusFilter !== "all"
                ? "No matching messages"
                : "Your inbox is empty"}
            </h3>

            <p>
              {search || statusFilter !== "all"
                ? "Try changing your search or status filter."
                : "Contact form enquiries will appear here."}
            </p>

            {(search || statusFilter !== "all") && (
              <button
                type="button"
                className="messages-secondary-btn"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="messages-table-wrapper">
            <table className="messages-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Subject</th>
                  <th>Message preview</th>
                  <th>Status</th>
                  <th>Date received</th>
                  <th className="messages-actions-heading">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredMessages.map((message) => (
                  <tr
                    key={message._id}
                    className={!message.isRead ? "message-unread-row" : ""}
                  >
                    <td>
                      <div className="messages-sender-cell">
                        <div className="messages-avatar">
                          {(message.name || "?")
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="messages-sender-info">
                          <strong>
                            {message.name || "Unknown sender"}
                          </strong>
                          <span>{message.email || "No email"}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="messages-subject">
                        {message.subject || "No subject"}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="messages-preview-btn"
                        onClick={() => handleOpenMessage(message)}
                      >
                        {message.message
                          ? `${message.message.slice(0, 58)}${
                              message.message.length > 58 ? "…" : ""
                            }`
                          : "Open message"}
                      </button>
                    </td>

                    <td>
                      <span
                        className={`messages-status ${
                          message.isRead
                            ? "messages-status-read"
                            : "messages-status-unread"
                        }`}
                      >
                        {message.isRead ? (
                          <MailOpen size={13} />
                        ) : (
                          <Mail size={13} />
                        )}
                        {message.isRead ? "Read" : "Unread"}
                      </span>
                    </td>

                    <td>
                      <span className="messages-date">
                        <CalendarDays size={14} />
                        {formatDate(message.createdAt)}
                      </span>
                    </td>

                    <td>
                      <div className="messages-row-actions">
                        <button
                          type="button"
                          className="messages-action-btn messages-view-btn"
                          onClick={() => handleOpenMessage(message)}
                          title="View message"
                          aria-label={`View message from ${message.name || "sender"}`}
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          className="messages-action-btn messages-delete-btn"
                          onClick={() => setDeleteTarget(message)}
                          title="Delete message"
                          aria-label={`Delete message from ${message.name || "sender"}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message details modal */}
      {selectedMessage && (
        <div
          className="messages-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDetails();
            }
          }}
        >
          <section
            className="messages-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="messages-detail-title"
          >
            <header className="messages-modal-header">
              <div className="messages-modal-title-icon">
                <MessageSquareText size={21} />
              </div>

              <div>
                <div className="messages-modal-eyebrow">
                  INBOX / MESSAGE DETAILS
                </div>
                <h2 id="messages-detail-title">Message Details</h2>
              </div>

              <button
                type="button"
                className="messages-modal-close"
                onClick={closeDetails}
                disabled={Boolean(markingReadId)}
                aria-label="Close message details"
              >
                <X size={19} />
              </button>
            </header>

            <div className="messages-detail-body">
              <div className="messages-detail-sender">
                <div className="messages-detail-avatar">
                  {(selectedMessage.name || "?")
                    .trim()
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h3>
                    {selectedMessage.name || "Unknown sender"}
                  </h3>
                  <p>{selectedMessage.email || "No email provided"}</p>
                </div>

                <span
                  className={`messages-status ${
                    selectedMessage.isRead
                      ? "messages-status-read"
                      : "messages-status-unread"
                  }`}
                >
                  {selectedMessage.isRead ? "Read" : "Unread"}
                </span>
              </div>

              <div className="messages-detail-divider" />

              <div className="messages-detail-meta">
                <div className="messages-meta-item">
                  <span className="messages-meta-icon">
                    <AtSign size={15} />
                  </span>
                  <div>
                    <span>Email address</span>
                    <strong>{selectedMessage.email || "—"}</strong>
                  </div>
                </div>

                <div className="messages-meta-item">
                  <span className="messages-meta-icon">
                    <Clock3 size={15} />
                  </span>
                  <div>
                    <span>Date received</span>
                    <strong>
                      {formatDate(selectedMessage.createdAt)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="messages-detail-subject">
                <span>SUBJECT</span>
                <h3>{selectedMessage.subject || "No subject"}</h3>
              </div>

              <div className="messages-detail-content">
                <div className="messages-content-heading">
                  <MessageSquareText size={15} />
                  <span>Message</span>
                </div>

                <p>
                  {selectedMessage.message || "No message content."}
                </p>
              </div>
            </div>

            <footer className="messages-modal-footer">
              {selectedMessage.email && (
                <a
                  className="messages-reply-btn"
                  href={`mailto:${selectedMessage.email}`}
                >
                  <ExternalLink size={15} />
                  Reply by email
                </a>
              )}

              <button
                type="button"
                className="messages-secondary-btn"
                onClick={closeDetails}
                disabled={Boolean(markingReadId)}
              >
                Close
              </button>
            </footer>
          </section>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div
          className="messages-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deletingId
            ) {
              setDeleteTarget(null);
            }
          }}
        >
          <section
            className="messages-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="messages-delete-title"
          >
            <button
              type="button"
              className="messages-modal-close"
              onClick={() => {
                if (!deletingId) setDeleteTarget(null);
              }}
              disabled={Boolean(deletingId)}
              aria-label="Close delete confirmation"
            >
              <X size={18} />
            </button>

            <div className="messages-delete-icon">
              <Trash2 size={24} />
            </div>

            <h2 id="messages-delete-title">Delete this message?</h2>

            <p>
              This will permanently delete the message from{" "}
              <strong>
                {deleteTarget.name || "this sender"}
              </strong>
              . This action cannot be undone.
            </p>

            <div className="messages-delete-actions">
              <button
                type="button"
                className="messages-secondary-btn"
                onClick={() => setDeleteTarget(null)}
                disabled={Boolean(deletingId)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="messages-confirm-delete-btn"
                onClick={handleDelete}
                disabled={Boolean(deletingId)}
              >
                {deletingId ? (
                  <>
                    <LoaderCircle size={16} className="messages-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Message
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

export default Messages;