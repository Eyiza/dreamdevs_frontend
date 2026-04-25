import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { toast } from "react-toastify";
import {
  useGetElectionsQuery,
  useGetElectionByIdQuery,
  useGetPositionsByElectionIdQuery,
  useGetCandidatesQuery,
  useGetVotersQuery,
  useVoteMutation,
} from "../apis/electionAppApi";

export default function Vote() {
  const { electionId: electionIdFromUrl } = useParams();

  // Steps: "nin" → "election" (skipped if URL has electionId) → "voting" → "summary" → "done"
  const [step, setStep] = useState("nin");
  const [nin, setNin] = useState("");
  const [ninError, setNinError] = useState("");
  const [voter, setVoter] = useState(null);
  const [electionId, setElectionId] = useState(electionIdFromUrl || "");
  const [positionIndex, setPositionIndex] = useState(0);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [voteError, setVoteError] = useState("");

  // Track votes cast in this session: [{ positionTitle, candidateName }]
  const [sessionVotes, setSessionVotes] = useState([]);

  const [castVote, { isLoading: isVoting }] = useVoteMutation();

  const { data: electionsData, isLoading: electionsLoading } = useGetElectionsQuery(undefined, {
    skip: !!electionIdFromUrl,
  });

  const { data: electionData, isLoading: electionLoading } = useGetElectionByIdQuery(electionId, {
    skip: !electionId,
  });

  const { data: positionsData, isLoading: positionsLoading } = useGetPositionsByElectionIdQuery(electionId, {
    skip: !electionId,
  });

  const { data: candidatesData, isLoading: candidatesLoading } = useGetCandidatesQuery(electionId, {
    skip: !electionId,
  });

  const { data: votersData, isLoading: votersLoading } = useGetVotersQuery();

  const elections = electionsData?.data || electionsData || [];
  const ongoingElections = elections.filter((e) => e.status === "ONGOING");
  const election = electionData?.data || electionData;
  const allPositions = positionsData?.data || positionsData || [];
  const totalPositions = allPositions.length;
  const allCandidates = candidatesData?.data || candidatesData || [];
  const allVoters = votersData?.data || votersData || [];

  // Positions this voter has NOT yet voted on
  const remainingPositions = allPositions.filter(
    (p) => !voter?.votedPositions?.includes(p.id)
  );

  const currentPosition = remainingPositions[positionIndex] || null;

  const candidatesForCurrentPosition = allCandidates.filter(
    (c) => c.positionId === currentPosition?.id
  );

  useEffect(() => {
    if (voter && remainingPositions.length > 0) {
      setPositionIndex(0);
      setSelectedCandidateId("");
    }
  }, [voter, allPositions.length]);

  // If election came from URL, skip election selection step once voter is confirmed
  useEffect(() => {
    if (electionIdFromUrl && voter) {
      setElectionId(electionIdFromUrl);
      setStep("voting");
    }
  }, [electionIdFromUrl, voter]);

  function handleNinSubmit(e) {
    e.preventDefault();
    if (!nin.trim()) { setNinError("NIN is required."); return; }
    if (nin.trim().length !== 11 || !/^\d+$/.test(nin.trim())) {
      setNinError("NIN must be exactly 11 digits.");
      return;
    }
    const foundVoter = allVoters.find((v) => v.nin === nin.trim());
    if (!foundVoter) {
      setNinError("No voter found with that NIN. Please register first.");
      return;
    }
    setVoter(foundVoter);
    setNinError("");
    if (electionIdFromUrl) {
      setElectionId(electionIdFromUrl);
      setStep("voting");
    } else {
      setStep("election");
    }
  }

  function handleElectionSelect(id) {
    setElectionId(id);
    setPositionIndex(0);
    setSelectedCandidateId("");
    setStep("voting");
  }

  async function handleVoteSubmit(e) {
    e.preventDefault();
    if (!selectedCandidateId) {
      setVoteError("Please select a candidate before submitting.");
      return;
    }
    setVoteError("");

    const votedCandidate = candidatesForCurrentPosition.find((c) => c.id === selectedCandidateId);

    try {
      await castVote({
        nin: voter.nin,
        candidateId: selectedCandidateId,
        positionId: currentPosition.id,
      }).unwrap();

      toast.success(`Vote cast for ${votedCandidate?.firstName}!`);

      setSessionVotes((prev) => [
        ...prev,
        {
          positionTitle: currentPosition.title,
          candidateName: `${votedCandidate?.firstName} ${votedCandidate?.lastName}`,
        },
      ]);

      setVoter((prev) => ({
        ...prev,
        votedPositions: [...(prev.votedPositions || []), currentPosition.id],
      }));

      setSelectedCandidateId("");

      // const stillRemaining = remainingPositions.filter((p) => p.id !== currentPosition.id);

      // if (stillRemaining.length > 0) {
      //   setPositionIndex(0);
      // } else {
      //   setStep("summary");
      // }
      if (positionIndex + 1 >= remainingPositions.length) {
        setStep("summary");
      } else {
        setPositionIndex((prev) => prev + 1);
      }
    } catch (error) {
      toast.error(error?.data?.data || "Failed to cast vote.");
    }
  }

  // function handleSkipPosition() {
  //   if (!currentPosition) {
  //       setStep("summary");
  //       return;
  //   }
  //   const stillRemaining = remainingPositions.filter((p) => p.id !== currentPosition.id);
  //   if (stillRemaining.length > 0) {
  //     setPositionIndex((prev) => prev + 1);
  //   } else {
  //     setStep("summary");
  //   }
  // }
  function handleSkipPosition() {
    if (positionIndex + 1 >= remainingPositions.length) {
      setStep("summary");
    } else {
      setPositionIndex((prev) => prev + 1);
    }
  }

  const statusMeta = {
    UPCOMING: { label: "Upcoming", bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
    ONGOING:  { label: "Live Now", bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
    ENDED:    { label: "Ended",    bg: "#f3f4f6", text: "#374151", dot: "#6b7280" },
  };

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
        <span className="text-white text-sm">Vote</span>
      </nav>

      <div className="mx-auto w-full max-w-lg px-6 py-12" style={{ animation: "fadeUp 0.4s ease both" }}>

        {step === "nin" && (
          <div>
            <div className="mb-8">
              <h1 className="m-0 mb-2 text-[clamp(24px,4vw,32px)] font-bold text-slate-900 leading-tight tracking-[-0.02em]">
                Cast Your Vote
              </h1>
              <p className="m-0 text-[15px] leading-6 text-slate-500">Enter your NIN to get started.</p>
            </div>

            <div className="rounded-[20px] bg-white border border-slate-200 shadow-[0_4px_24px_rgba(15,82,186,0.08)] px-8 py-9">
              <form onSubmit={handleNinSubmit} noValidate className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <label htmlFor="nin" className="block mb-1.5 text-[14px] font-semibold tracking-[0.03em] text-slate-600">
                    National Identification Number (NIN)
                  </label>
                  <input
                    id="nin"
                    type="text"
                    name="nin"
                    value={nin}
                    onChange={(e) => { setNin(e.target.value); setNinError(""); }}
                    placeholder="11-digit NIN"
                    maxLength={11}
                    required
                    className="w-full rounded-[10px] border border-slate-200 bg-white px-3.5 py-2.75 text-[15px] text-slate-800 outline-none box-border transition-colors duration-150 placeholder:text-slate-400 focus:border-blue-700 focus:shadow-[0_0_0_3px_rgba(15,82,186,0.1)]"
                  />
                  {ninError && <p className="m-0 mt-1 text-xs text-red-500">{ninError}</p>}
                </div>
                <button
                  type="submit"
                  disabled={votersLoading}
                  className="w-full rounded-xl border-0 px-4 py-3.5 text-[15px] font-bold text-white transition-colors duration-150 disabled:cursor-not-allowed disabled:bg-slate-400 bg-blue-800 hover:bg-blue-900"
                >
                  {votersLoading ? "Loading..." : "Continue"}
                </button>
              </form>
            </div>

            <p className="mt-4 text-center text-[13px] text-slate-400">
              Not registered?{" "}
              <Link to="/register" className="text-blue-700 no-underline font-medium">Register here</Link>
            </p>
          </div>
        )}

        {step === "election" && (
          <div>
            <div className="mb-8">
              <p className="m-0 mb-1 text-sm text-slate-400">Voting as</p>
              <h1 className="m-0 mb-2 text-[clamp(22px,4vw,28px)] font-bold text-slate-900 leading-tight tracking-[-0.02em]">
                {voter?.name}
              </h1>
              <p className="m-0 text-[15px] leading-6 text-slate-500">Select an ongoing election to vote in.</p>
            </div>

            {electionsLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 rounded-2xl"
                    style={{ background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }}
                  />
                ))}
              </div>
            ) : ongoingElections.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
                <p className="text-4xl">🗳️</p>
                <p className="mt-3 text-sm text-slate-500">No ongoing elections at the moment.</p>
                <Link to="/" className="mt-4 inline-block text-sm font-medium text-blue-700 no-underline">Back to Dashboard</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {ongoingElections.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => handleElectionSelect(e.id)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-[0_4px_16px_rgba(15,82,186,0.1)]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="m-0 text-[15px] font-bold text-slate-900">{e.title}</p>
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider shrink-0"
                        style={{ background: statusMeta.ONGOING.bg, color: statusMeta.ONGOING.text }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusMeta.ONGOING.dot, animation: "pulse 1.8s ease-in-out infinite" }} />
                        Live
                      </span>
                    </div>
                    <p className="m-0 mt-1 text-xs text-slate-400">
                      Ends {new Date(e.endDateTime).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === "voting" && (
          <div>
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="m-0 text-xs text-slate-400">Voting as</p>
                <p className="m-0 text-sm font-bold text-slate-800">{voter?.name}</p>
              </div>
              {electionLoading ? (
                <div className="h-5 w-36 rounded-lg"
                  style={{ background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }}
                />
              ) : (
                <p className="m-0 text-sm font-semibold text-blue-700">{election?.title}</p>
              )}
            </div>

            {/* Progress bar */}
            {!positionsLoading && remainingPositions.length > 0 && (
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                  <span>Position {sessionVotes.length + 1} of {allPositions.length}</span>
                  <span>{allPositions.length - sessionVotes.length - 1} remaining</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-200">
                  <div
                    className="h-1.5 rounded-full bg-blue-700 transition-all duration-500"
                    style={{ width: `${(sessionVotes.length / totalPositions) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {positionsLoading || candidatesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 rounded-2xl"
                    style={{ background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }}
                  />
                ))}
              </div>
            ) : remainingPositions.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
                <p className="text-4xl">✅</p>
                <p className="mt-3 text-base font-semibold text-slate-800">You've already voted in all positions.</p>
                <Link to="/" className="mt-4 inline-block text-sm font-medium text-blue-700 no-underline">Back to Dashboard</Link>
              </div>
            ) : (
              <div className="rounded-[20px] bg-white border border-slate-200 shadow-[0_4px_24px_rgba(15,82,186,0.08)] px-8 py-8">
                <p className="m-0 mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Voting for</p>
                <h2 className="m-0 mb-6 text-xl font-extrabold text-slate-900">{currentPosition?.title}</h2>

                {candidatesForCurrentPosition.length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="text-3xl">👤</p>
                    <p className="mt-2 text-sm text-slate-400">No candidates for this position.</p>
                    <button
                      onClick={handleSkipPosition}
                      className="mt-4 rounded-xl bg-blue-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-900"
                    >
                      Skip →
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleVoteSubmit} noValidate className="flex flex-col gap-3">
                    {candidatesForCurrentPosition.map((candidate) => (
                      <label
                        key={candidate.id}
                        className={`flex cursor-pointer items-center gap-4 rounded-xl border px-5 py-4 transition ${
                          selectedCandidateId === candidate.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-slate-200 bg-white hover:border-blue-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="candidate"
                          value={candidate.id}
                          checked={selectedCandidateId === candidate.id}
                          onChange={() => { setSelectedCandidateId(candidate.id); setVoteError(""); }}
                          className="accent-blue-700 h-4 w-4 shrink-0"
                        />
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                          {candidate.firstName?.[0]}{candidate.lastName?.[0]}
                        </div>
                        <div className="flex-1">
                          <p className="m-0 text-[15px] font-semibold text-slate-800">
                            {candidate.firstName} {candidate.lastName}
                          </p>
                          <p className="m-0 text-xs text-slate-400">{currentPosition?.title}</p>
                        </div>
                      </label>
                    ))}

                    {voteError && <p className="m-0 mt-1 text-xs text-red-500">{voteError}</p>}

                    <button
                      type="submit"
                      disabled={isVoting}
                      className="mt-2 w-full rounded-xl border-0 px-4 py-3.5 text-[15px] font-bold text-white transition-colors duration-150 disabled:cursor-not-allowed disabled:bg-slate-400 bg-blue-800 hover:bg-blue-900"
                    >
                      {isVoting ? "Submitting..." : "Submit Vote →"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step: Summary ─────────────────────────────────────────────── */}
        {step === "summary" && (
          <div>
            <div className="mb-8 text-center">
              <p className="text-5xl">🎉</p>
              <h1 className="mt-4 mb-2 text-[clamp(22px,4vw,28px)] font-bold text-slate-900 leading-tight tracking-[-0.02em]">
                Votes submitted!
              </h1>
              <p className="m-0 text-[15px] text-slate-500">
                Here's a summary of who you voted for, <strong>{voter?.name}</strong>.
              </p>
            </div>

            <div className="rounded-[20px] bg-white border border-slate-200 shadow-[0_4px_24px_rgba(15,82,186,0.08)] px-8 py-6 mb-5">
              {sessionVotes.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No votes were cast in this session.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {sessionVotes.map((vote, index) => (
                    <div key={index} className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 px-5 py-4">
                      <div>
                        <p className="m-0 text-xs font-semibold uppercase tracking-wider text-slate-400">{vote.positionTitle}</p>
                        <p className="m-0 mt-0.5 text-[15px] font-bold text-slate-800">{vote.candidateName}</p>
                      </div>
                      <span className="text-emerald-500 text-xl shrink-0">✓</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Link
                to={`/election/${electionId}/results`}
                className="w-full rounded-xl bg-blue-800 px-4 py-3.5 text-[15px] font-bold text-white no-underline text-center transition hover:bg-blue-900"
              >
                View Results
              </Link>
              <Link
                to="/"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-[15px] font-semibold text-slate-700 no-underline text-center transition hover:bg-slate-50"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
