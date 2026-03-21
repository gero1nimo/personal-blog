import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { projectsApi } from "../services/api";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await projectsApi.getById(id); // GET /projects/{id}
        setProject(res?.data ?? null);
      } catch (err) {
        setError("Project could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <section className="min-h-[60vh] bg-slate-950 text-slate-100 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-slate-400">Loading project...</p>
        </div>
      </section>
    );
  }

  if (error || !project) {
    return (
      <section className="min-h-[60vh] bg-slate-950 text-slate-100 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-rose-400 mb-4">{error || "Project not found."}</p>
          <Link
            to="/portfolio"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 transition"
          >
            Back to Portfolio
          </Link>
        </div>
      </section>
    );
  }

  const {
    title,
    name,
    description,
    long_description,
    status,
    technologies,
    tech_stack,
    github_url,
    live_url,
    image_url,
    created_at,
  } = project;

  const displayTitle = title || name || "Untitled Project";
  const displayTech = technologies || tech_stack || [];

  return (
    <section className="bg-slate-950 text-slate-100 px-4 py-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/portfolio"
          className="inline-flex items-center text-sm text-indigo-300 hover:text-indigo-200 transition mb-8"
        >
          ← Back to Portfolio
        </Link>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
          {image_url ? (
            <img
              src={image_url}
              alt={displayTitle}
              className="h-64 w-full object-cover md:h-80"
            />
          ) : null}

          <div className="p-6 md:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {displayTitle}
              </h1>
              {status ? (
                <span className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
                  {status}
                </span>
              ) : null}
            </div>

            {created_at ? (
              <p className="mb-4 text-sm text-slate-400">
                {new Date(created_at).toLocaleDateString()}
              </p>
            ) : null}

            <p className="text-slate-300 leading-relaxed">
              {long_description || description || "No description provided."}
            </p>

            {Array.isArray(displayTech) && displayTech.length > 0 ? (
              <div className="mt-6">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Tech Stack
                </h2>
                <div className="flex flex-wrap gap-2">
                  {displayTech.map((tech, idx) => (
                    <span
                      key={`${tech}-${idx}`}
                      className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              {live_url ? (
                <a
                  href={live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 transition"
                >
                  Live Demo
                </a>
              ) : null}
              {github_url ? (
                <a
                  href={github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:border-slate-500 hover:bg-slate-800 transition"
                >
                  GitHub
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}