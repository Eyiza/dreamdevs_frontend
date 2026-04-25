import { useParams, Link } from "react-router";
import { useGetElectionByIdQuery, useGetPositionsByElectionIdQuery, useGetResultByPositionQuery } from "../apis/electionAppApi";

// Fetches and renders results for a single position
function PositionResults({ position }) {
  const { data, isLoading, isError } = useGetResultByPositionQuery(position.id);
  const candidates = data?.data || data || [];
  const totalVotes = candidates.reduce((sum, c) => sum + (c.voteCount || 0), 0);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
        <div
          className="mb-5 h-5 w-40 rounded-lg"
          style={{
            background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s infinite",
          }}
        />
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-14 rounded-xl"
              style={{
                background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.4s infinite",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 px-8 py-6">
        <p className="m-0 text-sm font-semibold text-red-700">{position.title}</p>
        <p className="m-0 mt-1 text-xs text-red-400">Failed to load results for this position.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
      {/* Position header */}
      <div className="mb-5 flex items-center justify-between gap-3 flex-wrap">
        <h3 className="m-0 text-base font-extrabold text-slate-900">{position.title}</h3>
        <span className="text-xs text-slate-400">{totalVotes} vote{totalVotes !== 1 ? "s" : ""} total</span>
      </div>

      {candidates.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-3xl">👤</p>
          <p className="mt-2 text-sm text-slate-400">No candidates registered for this position.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {candidates.map((candidate, index) => {
            const voteShare = totalVotes > 0 ? Math.round((candidate.voteCount / totalVotes) * 100) : 0;
            const isLeader = index === 0 && candidate.voteCount > 0;

            return (
              <div key={candidate.id}>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank number */}
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      index === 0 ? "bg-amber-100 text-amber-700" :
                      index === 1 ? "bg-slate-100 text-slate-600" :
                      index === 2 ? "bg-orange-50 text-orange-600" :
                      "bg-slate-50 text-slate-400"
                    }`}>
                      {index + 1}
                    </span>

                    {/* Initials avatar */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      {candidate.firstName?.[0]}{candidate.lastName?.[0]}
                    </div>

                    <div className="min-w-0">
                      <p className="m-0 truncate text-sm font-semibold text-slate-800">
                        {candidate.firstName} {candidate.lastName}
                        {isLeader && (
                          <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                            Leading
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-slate-800">{candidate.voteCount ?? 0}</span>
                    <span className="ml-1 text-xs text-slate-400">{voteShare}%</span>
                  </div>
                </div>

                {/* Vote share bar */}
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ${
                      index === 0 ? "bg-amber-400" :
                      index === 1 ? "bg-blue-400" :
                      "bg-slate-300"
                    }`}
                    style={{ width: `${voteShare}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main Results page ─────────────────────────────────────────────────────────

export default function Results() {
  const { electionId } = useParams();

  const { data: electionData, isLoading: electionLoading, isError: electionError } = useGetElectionByIdQuery(electionId);
  const { data: positionsData, isLoading: positionsLoading } = useGetPositionsByElectionIdQuery(electionId);

  const election = electionData?.data || electionData;
  const positions = positionsData?.data || positionsData || [];

  const statusMeta = {
    UPCOMING: { label: "Upcoming", bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
    ONGOING:  { label: "Live Now", bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
    ENDED:    { label: "Ended",    bg: "#f3f4f6", text: "#374151", dot: "#6b7280" },
  };
  const currentStatus = statusMeta[election?.status] || statusMeta.ENDED;

  if (electionError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <p className="text-5xl">⚠️</p>
          <p className="mt-2 text-slate-500">Election not found or failed to load.</p>
          <Link to="/" className="mt-3 inline-block text-sm font-medium text-blue-700 no-underline">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      <nav className="h-14 bg-blue-800 px-7 flex items-center gap-3">
        <Link to="/" className="text-white/75 text-sm no-underline">&larr; Dashboard</Link>
        <span className="text-white/30 text-sm">/</span>
        <Link to={`/election/${electionId}`} className="text-white/75 text-sm no-underline">
          {electionLoading ? "Loading..." : (election?.title || "Election")}
        </Link>
        <span className="text-white/30 text-sm">/</span>
        <span className="text-white text-sm">Results</span>
      </nav>

      <div className="mx-auto w-full max-w-2xl px-6 py-10" style={{ animation: "fadeUp 0.4s ease both" }}>

        {/* Election header card */}
        <div className="mb-7 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          {electionLoading ? (
            <div className="flex flex-col gap-3">
              <div className="h-6 w-52 rounded-lg"
                style={{ background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }}
              />
              <div className="h-4 w-32 rounded-lg"
                style={{ background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }}
              />
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="m-0 text-xl font-extrabold text-slate-900 tracking-tight">{election?.title}</h1>
                <p className="m-0 mt-1 text-xs text-slate-400">
                  {positions.length} position{positions.length !== 1 ? "s" : ""}
                </p>
              </div>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-wider"
                style={{ background: currentStatus.bg, color: currentStatus.text }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: currentStatus.dot,
                    animation: election?.status === "ONGOING" ? "pulse 1.8s ease-in-out infinite" : "none",
                  }}
                />
                {currentStatus.label}
              </span>
            </div>
          )}
        </div>

        {/* Live notice for ongoing elections */}
        {election?.status === "ONGOING" && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            🟢 This election is currently live — results update as votes come in.
          </div>
        )}

        {/* Position results */}
        {positionsLoading ? (
          <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-2xl"
                style={{ background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }}
              />
            ))}
          </div>
        ) : positions.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-12 text-center shadow-sm">
            <p className="text-4xl">📊</p>
            <p className="mt-3 text-sm text-slate-500">No positions found for this election.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {positions.map((position) => (
              <PositionResults key={position.id} position={position} />
            ))}
          </div>
        )}

        {/* Footer actions */}
        {!electionLoading && !positionsLoading && positions.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {election?.status === "ONGOING" && (
              <Link
                to={`/election/${electionId}/vote`}
                className="flex-1 rounded-xl bg-blue-800 px-4 py-3 text-center text-sm font-semibold text-white no-underline transition hover:bg-blue-900"
              >
                Cast Your Vote
              </Link>
            )}
            <Link
              to={`/election/${electionId}`}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 no-underline transition hover:bg-slate-50"
            >
              Election Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
