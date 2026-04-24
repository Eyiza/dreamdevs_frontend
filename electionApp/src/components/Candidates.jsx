import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import {
  useGetElectionByIdQuery,
  useGetPositionsByElectionIdQuery,
  useCreateCandidateMutation,
  useGetCandidatesQuery,
} from "../apis/electionAppApi";

export default function Candidates() {
  const { electionId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    positionId: searchParams.get("position") || "",
  });
  const [errors, setErrors] = useState({});

  const [createCandidate, { isLoading: isCreating }] = useCreateCandidateMutation();

  const { data: electionData, isLoading: electionLoading } = useGetElectionByIdQuery(electionId);
  const { data: positionsData, isLoading: positionsLoading } = useGetPositionsByElectionIdQuery(electionId);
  const { data: candidatesData, isLoading: candidatesLoading, isFetching: candidatesFetching } = useGetCandidatesQuery(electionId);

  const election = electionData?.data || electionData;
  const positions = positionsData?.data || positionsData || [];
  const allCandidates = candidatesData?.data || candidatesData || [];

  const isUpcoming = election?.status === "UPCOMING";
  const isListLoading = candidatesLoading || candidatesFetching;

  const displayedCandidates = form.positionId
    ? allCandidates.filter((c) => c.positionId === form.positionId)
    : allCandidates;

  useEffect(() => {
    const positionFromUrl = searchParams.get("position");
    if (positionFromUrl) {
      setForm((prev) => ({ ...prev, positionId: positionFromUrl }));
    }
  }, [searchParams]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "positionId") {
      if (value) setSearchParams({ position: value });
      else setSearchParams({});
    }
  }

  function handleListPositionChange(e) {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, positionId: value }));
    if (value) setSearchParams({ position: value });
    else setSearchParams({});
  }

  function validate() {
    const possibleErrors = {};
    if (!form.positionId) possibleErrors.positionId = "Please select a position.";
    if (!form.firstName.trim()) possibleErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) possibleErrors.lastName = "Last name is required.";
    return possibleErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const possibleErrors = validate();
    if (Object.keys(possibleErrors).length > 0) {
      setErrors(possibleErrors);
      return;
    }
    try {
      await createCandidate({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        positionId: form.positionId,
      }).unwrap();
      toast.success(`${form.firstName} ${form.lastName} registered as a candidate!`);
      setForm((prev) => ({ ...prev, firstName: "", lastName: "" }));
    } catch (error) {
      toast.error(error?.data?.data || "Failed to register candidate.");
    }
  }

  function getListLabel() {
    if (form.positionId) return `Candidates for: ${positions.find((p) => p.id === form.positionId)?.title || "selected position"}`;
    return "All candidates in this election";
  }

  const statusMeta = {
    UPCOMING: { label: "Upcoming", bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
    ONGOING:  { label: "Live Now", bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
    ENDED:    { label: "Ended",    bg: "#f3f4f6", text: "#374151", dot: "#6b7280" },
  };
  const currentStatus = statusMeta[election?.status] || statusMeta.ENDED;

  return (
    <div className="min-h-screen bg-slate-100">
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      <nav className="h-14 bg-blue-800 px-7 flex items-center gap-3">
        <Link to="/" className="text-white/75 text-sm no-underline">
          &larr; Dashboard
        </Link>
        <span className="text-white/30 text-sm">/</span>
        <Link to={`/election/${electionId}`} className="text-white/75 text-sm no-underline">
          {electionLoading ? "Loading..." : (election?.title || "Election")}
        </Link>
        <span className="text-white/30 text-sm">/</span>
        <span className="text-white text-sm">Candidates</span>
      </nav>

      <div className="mx-auto w-full max-w-3xl px-6 py-10" style={{ animation: "fadeUp 0.4s ease both" }}>

        {/* Election strip */}
        <div className="mb-7 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm flex flex-wrap items-center justify-between gap-3">
          {electionLoading ? (
            <div
              className="h-6 w-48 rounded-lg"
              style={{
                background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.4s infinite",
              }}
            />
          ) : (
            <>
              <h1 className="m-0 text-lg font-extrabold text-slate-900 tracking-tight">
                {election?.title}
              </h1>
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
            </>
          )}
        </div>

        {!electionLoading && (
          <div className="mb-7 rounded-2xl border border-slate-200 bg-white px-8 py-8 shadow-[0_4px_24px_rgba(15,82,186,0.08)]">
            <h2 className="m-0 mb-6 text-lg font-extrabold text-slate-900">Register Candidate</h2>

            {!isUpcoming ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                ⚠️ Candidates can only be registered while the election is <strong>Upcoming</strong>.
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

                <div className="flex flex-col gap-1">
                  <label htmlFor="positionId" className="block mb-1.5 text-[14px] font-semibold tracking-[0.03em] text-slate-600">
                    Position
                  </label>
                  {positionsLoading ? (
                    <div
                      className="h-11 w-full rounded-[10px]"
                      style={{
                        background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.4s infinite",
                      }}
                    />
                  ) : (
                    <select
                      id="positionId"
                      name="positionId"
                      value={form.positionId}
                      onChange={handleChange}
                      className="w-full rounded-[10px] border border-slate-200 bg-white px-3.5 py-2.75 text-[15px] text-slate-800 outline-none box-border transition-colors duration-150 focus:border-blue-700 focus:shadow-[0_0_0_3px_rgba(15,82,186,0.1)]"
                    >
                      <option value="">-- Select a position --</option>
                      {positions.map((pos) => (
                        <option key={pos.id} value={pos.id}>{pos.title}</option>
                      ))}
                    </select>
                  )}
                  {errors.positionId && (
                    <p className="m-0 mt-1 text-xs text-red-500">{errors.positionId}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="firstName" className="block mb-1.5 text-[14px] font-semibold tracking-[0.03em] text-slate-600">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="e.g. John"
                      required
                      className="w-full rounded-[10px] border border-slate-200 bg-white px-3.5 py-2.75 text-[15px] text-slate-800 outline-none box-border transition-colors duration-150 placeholder:text-slate-400 focus:border-blue-700 focus:shadow-[0_0_0_3px_rgba(15,82,186,0.1)]"
                    />
                    {errors.firstName && (
                      <p className="m-0 mt-1 text-xs text-red-500">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="lastName" className="block mb-1.5 text-[14px] font-semibold tracking-[0.03em] text-slate-600">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="e.g. Doe"
                      required
                      className="w-full rounded-[10px] border border-slate-200 bg-white px-3.5 py-2.75 text-[15px] text-slate-800 outline-none box-border transition-colors duration-150 placeholder:text-slate-400 focus:border-blue-700 focus:shadow-[0_0_0_3px_rgba(15,82,186,0.1)]"
                    />
                    {errors.lastName && (
                      <p className="m-0 mt-1 text-xs text-red-500">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full rounded-xl border-0 px-4 py-3.5 text-[15px] font-bold tracking-[0.01em] text-white transition-colors duration-150 disabled:cursor-not-allowed disabled:bg-slate-400 bg-blue-800 hover:bg-blue-900"
                >
                  {isCreating ? "Registering..." : "Register Candidate"}
                </button>
              </form>
            )}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-8 shadow-[0_4px_24px_rgba(15,82,186,0.08)]">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="m-0 text-lg font-extrabold text-slate-900">
                Candidates
                {!isListLoading && (
                  <span className="ml-2 text-sm font-medium text-slate-400">
                    ({displayedCandidates.length})
                  </span>
                )}
              </h2>
              <p className="m-0 mt-1 text-sm text-slate-400">{getListLabel()}</p>
            </div>

            {!positionsLoading && positions.length > 0 && (
              <select
                value={form.positionId}
                onChange={handleListPositionChange}
                className="rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-700"
              >
                <option value="">All positions</option>
                {positions.map((pos) => (
                  <option key={pos.id} value={pos.id}>{pos.title}</option>
                ))}
              </select>
            )}
          </div>

          {isListLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-16 rounded-xl"
                  style={{
                    background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.4s infinite",
                  }}
                />
              ))}
            </div>
          ) : displayedCandidates.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-4xl">&#128100;</p>
              <p className="mt-2 text-sm text-slate-400">
                {form.positionId ? "No candidates for this position yet." : "No candidates registered yet."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {displayedCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 px-5 py-4 transition hover:shadow-[0_4px_16px_rgba(15,82,186,0.08)]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {candidate.firstName?.[0]}{candidate.lastName?.[0]}
                  </div>
                  <div className="flex-1">
                    <p className="m-0 text-[15px] font-semibold text-slate-800">
                      {candidate.firstName} {candidate.lastName}
                    </p>
                    <p className="m-0 text-xs text-slate-400">
                      {candidate.positionTitle || positions.find((p) => p.id === candidate.positionId)?.title || "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="m-0 text-sm font-bold text-slate-700">{candidate.voteCount ?? 0}</p>
                    <p className="m-0 text-xs text-slate-400">votes</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
