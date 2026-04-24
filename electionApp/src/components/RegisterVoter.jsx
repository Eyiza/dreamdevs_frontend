import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useCreateVoterMutation } from "../apis/electionAppApi";

export default function RegisterVoter() {
  const [form, setForm] = useState({ name: "", nin: "" });
  const [errors, setErrors] = useState({});
  const [createVoter, { isLoading }] = useCreateVoterMutation();
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const possibleErrors = {};
    if (!form.name.trim()) possibleErrors.name = "Full name is required.";
    if (!form.nin.trim()) possibleErrors.nin = "NIN is required.";
    else if (form.nin.trim().length !== 11 || !/^\d+$/.test(form.nin.trim()))
      possibleErrors.nin = "NIN must be exactly 11 digits.";
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
      await createVoter({ name: form.name.trim(), nin: form.nin.trim() }).unwrap();
      toast.success("Voter registered successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.data || "Failed to register voter.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <nav className="h-14 bg-blue-800 px-7 flex items-center gap-3">
        <Link to="/" className="text-white/75 text-sm no-underline flex items-center gap-1">
          &larr; Back to Dashboard
        </Link>
        <span className="text-white/30 text-sm">/</span>
        <span className="text-white text-sm">Register Voter</span>
      </nav>

      <div className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <h1 className="m-0 mb-2 text-[clamp(24px,4vw,32px)] font-bold text-slate-900 leading-tight tracking-[-0.02em]">
              Register Voter
            </h1>
            <p className="m-0 text-[15px] leading-6 text-slate-500">
              Enter the voter's details to register them for elections.
            </p>
          </div>

          <div className="rounded-[20px] bg-white border border-slate-200 shadow-[0_4px_24px_rgba(15,82,186,0.08),0_1px_4px_rgba(0,0,0,0.04)] px-8 py-9">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="name"
                  className="block mb-1.5 text-[14px] font-semibold tracking-[0.03em] text-slate-600"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  required
                  className="w-full rounded-[10px] border border-slate-200 bg-white px-3.5 py-2.75 text-[15px] text-slate-800 outline-none box-border transition-colors duration-150 placeholder:text-slate-400 focus:border-blue-700 focus:shadow-[0_0_0_3px_rgba(15,82,186,0.1)]"
                />
                {errors.name && (
                  <p className="m-0 mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="nin"
                  className="block mb-1.5 text-[14px] font-semibold tracking-[0.03em] text-slate-600"
                >
                  National Identification Number (NIN)
                </label>
                <input
                  id="nin"
                  type="text"
                  name="nin"
                  value={form.nin}
                  onChange={handleChange}
                  placeholder="11-digit NIN"
                  maxLength={11}
                  required
                  className="w-full rounded-[10px] border border-slate-200 bg-white px-3.5 py-2.75 text-[15px] text-slate-800 outline-none box-border transition-colors duration-150 placeholder:text-slate-400 focus:border-blue-700 focus:shadow-[0_0_0_3px_rgba(15,82,186,0.1)]"
                />
                <p className="m-0 mt-1 text-xs text-slate-400">
                  Must be exactly 11 digits. This is your unique voter identifier.
                </p>
                {errors.nin && (
                  <p className="m-0 mt-1 text-xs text-red-500">{errors.nin}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl border-0 px-4 py-3.5 text-[15px] font-bold tracking-[0.01em] text-white transition-colors duration-150 disabled:cursor-not-allowed disabled:bg-slate-400 bg-blue-800 hover:bg-blue-900"
              >
                {isLoading ? "Registering..." : "Register Voter"}
              </button>
            </form>
          </div>

          <p className="mt-4 text-center text-[13px] text-slate-400">
            Already registered? You can vote from any active election on the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
