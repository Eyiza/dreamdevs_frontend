import React, {useEffect, useState} from 'react'
import { useGetElectionsQuery } from '../apis/electionAppApi';
import { Link } from 'react-router';
import { toast } from 'react-toastify'

const Home = () => {
  const { data, isLoading, isError, error } = useGetElectionsQuery();

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.data || 'Failed to fetch elections.');
    }
  }, [isError, error]);

  const elections = data?.data || [];

  const ongoingCount = elections.filter((data) => data.status === 'ONGOING').length;
  const upcomingCount = elections.filter((data) => data.status === 'UPCOMING').length;
  const endedCount = elections.filter((data) => data.status === 'ENDED').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-10 w-64 rounded bg-slate-200" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="h-24 rounded-xl bg-slate-200" />
            <div className="h-24 rounded-xl bg-slate-200" />
            <div className="h-24 rounded-xl bg-slate-200" />
          </div>
          <div className="h-12 rounded-xl bg-slate-200" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="h-40 rounded-xl bg-slate-200" />
            <div className="h-40 rounded-xl bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">Election Dashboard</h1>
          <p className="mt-2 text-slate-600">Create and Track elections.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Ongoing</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">{ongoingCount}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Upcoming</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">{upcomingCount}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Ended</p>
            <p className="mt-2 text-3xl font-bold text-slate-700">{endedCount}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            to="/vote"
            className="rounded-xl bg-blue-600 px-5 py-4 text-center font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            Vote Now
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-indigo-600 px-5 py-4 text-center font-medium text-white shadow-sm transition hover:bg-indigo-700"
          >
            Register
          </Link>
          <Link
            to="/elections/create"
            className="rounded-xl bg-emerald-600 px-5 py-4 text-center font-medium text-white shadow-sm transition hover:bg-emerald-700"
          >
            Create Election
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Elections</h2>

          {elections.length === 0 ? (
            <p className="mt-4 text-slate-500">No elections available yet.</p>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {elections.map((election) => (
                <div key={election.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-slate-800">{election.title}</h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        election.status === 'ONGOING'
                          ? 'bg-emerald-100 text-emerald-700'
                          : election.status === 'UPCOMING'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {election.status}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 text-sm text-slate-600">
                    <p>Start: {new Date(election.startDateTime).toLocaleString()}</p>
                    <p>End: {new Date(election.endDateTime).toLocaleString()}</p>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <Link to={`/election/${election.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                      View
                    </Link>
                    <Link to={`/election/${election.id}/vote`} className="text-sm font-medium text-indigo-600 hover:underline">
                      Vote
                    </Link>
                    <Link to={`/election/${election.id}/results`} className="text-sm font-medium text-emerald-700 hover:underline">
                      View Results
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Candidate Results / Leaderboard</h2>
          <p className="mt-2 text-sm text-slate-600">
            Select an election above and open <span className="font-medium">View Results</span> to see candidate rankings.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home