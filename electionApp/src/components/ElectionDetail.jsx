import { useState } from "react";
import { useParams, Link } from "react-router";
import { toast } from "react-toastify";
import {
  useGetElectionByIdQuery,
  useGetPositionsByElectionIdQuery,
  useCreatePositionMutation,
} from "../apis/electionAppApi";

export default function ElectionDetail() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [focused, setFocused] = useState(false);

  const [createPosition, { isLoading: isCreating }] =
    useCreatePositionMutation();

  const {
    data: electionData,
    isLoading: electionLoading,
    isError: electionError,
  } = useGetElectionByIdQuery(id);

  const {
    data: positionsData,
    isLoading: positionsLoading,
  } = useGetPositionsByElectionIdQuery(id);

  const election = electionData?.data || electionData;
  const positions = positionsData?.data || positionsData || [];
  const isUpcoming = election?.status === "UPCOMING";

  const statusMeta = {
    UPCOMING: {
      label: "Upcoming",
      dot: "#f59e0b",
      bg: "#fef3c7",
      text: "#92400e",
    },
    ONGOING: {
      label: "Live Now",
      dot: "#10b981",
      bg: "#d1fae5",
      text: "#065f46",
    },
    ENDED: {
      label: "Ended",
      dot: "#6b7280",
      bg: "#f3f4f6",
      text: "#374151",
    },
  };

  function formatDate (dt) {
    if (!dt) return "—";
    return new Date(dt).toLocaleString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.warning("Position title cannot be empty.");
      return;
    }

    try {
      await createPosition({
        title: title.trim(),
        electionId: id,
      }).unwrap();
      toast.success("Position added successfully!");
      setTitle("");
    } catch (err) {
      // console.log(err.data.data);
      toast.error(err?.data?.data || "Failed to add position.");
    }
  };

  if (electionError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <p className="text-5xl">⚠️</p>
          <p className="mt-2 text-slate-500">
            Election not found or failed to load.
          </p>
          <Link to="/" className="mt-3 inline-block text-blue-700">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentStatus = statusMeta[election?.status] || statusMeta.ENDED;

  return (
    <div className="min-h-screen bg-slate-100">
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <nav className="flex h-14 items-center gap-3 bg-blue-700 px-7">
        <Link to="/" className="text-sm text-white/75 no-underline">
          &larr; Dashboard
        </Link>
        <span className="text-sm text-white/30">/</span>
        <span className="max-w-70 truncate text-sm text-white">
          {electionLoading ? "Loading..." : election?.title || "Election Detail"}
        </span>
      </nav>

      <div
        className="mx-auto w-full max-w-3xl px-6 py-10"
        style={{ animation: "fadeUp 0.4s ease both" }}
      >
        <div className="relative mb-7 overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_4px_24px_rgba(15,82,186,0.08)]">
          {election?.status === "ONGOING" && (
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-500 to-emerald-600" />
          )}

          {electionLoading ? (
            <div className="flex flex-col gap-3">
              <div
                className="h-7 w-64 rounded-lg"
                style={{
                  background:
                    "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.4s infinite",
                }}
              />
              <div
                className="h-4 w-36 rounded-lg"
                style={{
                  background:
                    "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.4s infinite",
                }}
              />
              <div
                className="h-4 w-52 rounded-lg"
                style={{
                  background:
                    "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.4s infinite",
                }}
              />
            </div>
          ) : (
            <>
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <h1 className="text-[clamp(20px,3vw,26px)] font-extrabold leading-tight tracking-[-0.02em] text-slate-900">
                  {election?.title}
                </h1>

                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-wider"
                  style={{
                    background: currentStatus.bg,
                    color: currentStatus.text,
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      background: currentStatus.dot,
                      animation:
                        election?.status === "ONGOING"
                          ? "pulse 1.8s ease-in-out infinite"
                          : "none",
                    }}
                  />
                  {currentStatus.label}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-sm">
                  <span className="min-w-10 text-slate-400">Start</span>
                  <span className="text-slate-700">
                    {formatDate(election?.startDateTime)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="min-w-10 text-slate-400">End</span>
                  <span className="text-slate-700">
                    {formatDate(election?.endDateTime)}
                  </span>
                </div>
              </div>

              {!isUpcoming && (
                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  ⚠️ Positions can only be added while the election is{" "}
                  <strong>Upcoming</strong>.
                </div>
              )}
            </>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_4px_24px_rgba(15,82,186,0.08)]">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-extrabold text-slate-900">
              Positions
              {!positionsLoading && (
                <span className="ml-2 text-sm font-medium text-slate-400">
                  ({positions.length})
                </span>
              )}
            </h2>

            <Link
              to={`/election/${id}/candidates`}
              className="text-sm font-semibold text-blue-700 no-underline"
            >
              View all candidates 
            </Link>
          </div>

          {isUpcoming && !electionLoading && (
            <div className="mb-6 border-b border-slate-100 pb-6">
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-wrap items-center gap-3"
              >
                <input
                  type="text"
                  placeholder="e.g. President, Governor..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  className={`min-w-0 flex-1 rounded-xl border px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-blue-100 ${
                    focused ? "border-blue-700" : "border-slate-200"
                  }`}
                />

                <button
                  type="submit"
                  disabled={isCreating}
                  className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition ${
                    isCreating
                      ? "cursor-not-allowed bg-slate-400"
                      : "bg-blue-700 hover:bg-blue-800"
                  }`}
                >
                  {isCreating ? "Adding..." : "+ Add Position"}
                </button>
              </form>
            </div>
          )}

          {positionsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-16 rounded-xl"
                  style={{
                    background:
                      "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.4s infinite",
                  }}
                />
              ))}
            </div>
          ) : positions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-4xl">&#128450;</p>
              <p className="mt-2 text-sm text-slate-400">
                No positions yet.{isUpcoming ? " Add one above." : ""}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {positions.map((position) => (
                <div
                  key={position.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:shadow-[0_4px_16px_rgba(15,82,186,0.08)]"
                >
                  <div>
                    <p className="m-0 text-[15px] font-bold text-slate-900">
                      {position.title}
                    </p>
                  </div>

                  <Link
                    to={`/election/${id}/positions/${position.id}/candidates`}
                    className="whitespace-nowrap text-sm font-semibold text-blue-700 no-underline"
                  >
                    Manage Candidates
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to={`/election/${id}/candidates`}
            className="flex-1 rounded-xl bg-blue-700 px-4 py-3 text-center text-sm font-semibold text-white no-underline"
          >
            Manage Candidates
          </Link>

          <Link
            to={`/election/${id}/results`}
            className="flex-1 rounded-xl border border-blue-700 bg-white px-4 py-3 text-center text-sm font-semibold text-blue-700 no-underline"
          >
            &#128202; View Results
          </Link>
        </div>
      </div>
    </div>
  );
}
