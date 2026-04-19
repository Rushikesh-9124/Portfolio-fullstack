"use client";
import { useEffect, useState } from "react";
import { aboutAPI, skillsAPI, projectsAPI, certificatesAPI } from "../lib/api";
import { fallbackData } from "../public/fallbackData";

import Navbar from "./components/Navbar";
import HeroSection from "./components/sections/HeroSection";
import AboutSection from "./components/sections/AboutSection";
import SkillsSection from "./components/sections/SkillsSection";
import ProjectsSection from "./components/sections/ProjectsSection";
import CertificatesSection from "./components/sections/CertificatesSection";
import ContactSection from "./components/sections/ContactSection";
import Footer from "./components/Footer";

function SkeletonBlock({ className }) {
  return <div className={`skeleton rounded-xl ${className}`} />;
}

export default function HomePage() {
  // ✅ START WITH FALLBACK DATA
  const [data, setData] = useState({
    about: fallbackData.about,
    skills: fallbackData.skills || [],
    projects: fallbackData.projects || [],
    certificates: fallbackData.certificates || [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [aboutRes, skillsRes, projectsRes, certsRes] =
          await Promise.allSettled([
            aboutAPI.get(),
            skillsAPI.getAll(),
            projectsAPI.getAll(),
            certificatesAPI.getAll(),
          ]);

        setData({
          about:
            aboutRes.status === "fulfilled"
              ? {
                  ...aboutRes.value?.data?.data,
                  timeline: Array.isArray(aboutRes.value?.data?.data?.timeline)
                    ? aboutRes.value.data.data.timeline
                    : [],
                }
              : fallbackData.about,

          skills:
            skillsRes.status === "fulfilled"
              ? skillsRes.value?.data?.data
              : fallbackData.skills,

          projects:
            projectsRes.status === "fulfilled"
              ? projectsRes.value?.data?.data
              : fallbackData.projects,

          certificates:
            certsRes.status === "fulfilled"
              ? certsRes.value?.data?.data
              : fallbackData.certificates,
        });
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <Navbar />

      {/* ✅ OPTION 1: Show skeleton ONLY if you want */}
      {loading && (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="space-y-4 w-full max-w-md">
            <SkeletonBlock className="h-8 w-40 mx-auto" />
            <SkeletonBlock className="h-16 w-full" />
            <SkeletonBlock className="h-6 w-3/4 mx-auto" />
            <SkeletonBlock className="h-12 w-48 mx-auto" />
          </div>
        </div>
      )}

      {/* ✅ ALWAYS RENDER CONTENT (fallback OR API) */}
      <HeroSection about={data.about} />
      <AboutSection about={data.about} />
      <SkillsSection skills={data.skills} />
      <ProjectsSection projects={data.projects} />
      <CertificatesSection certificates={data.certificates} />
      <ContactSection about={data.about} />
      <Footer about={data.about} />
    </main>
  );
}
