"use client";
import { useEffect, useState } from "react";
import { aboutAPI, skillsAPI, projectsAPI, certificatesAPI } from "../lib/api";
import Navbar from "./components/Navbar";
import HeroSection from "./components/sections/HeroSection";
import AboutSection from "./components/sections/AboutSection";
import SkillsSection from "./components/sections/SkillsSection";
import ProjectsSection from "./components/sections/ProjectsSection";
import CertificatesSection from "./components/sections/CertificatesSection";
import ContactSection from "./components/sections/ContactSection";
import Footer from "./components/Footer";

/**
 * Responsive Skeleton Block
 */
function SkeletonBlock({ className }) {
  return (
    <div className={`skeleton rounded-xl animate-pulse bg-white/5 ${className}`} />
  );
}

export default function HomePage() {
  const [data, setData] = useState({
    about: null,
    skills: [],
    projects: [],
    certificates: [],
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
            aboutRes.status === "fulfilled" ? aboutRes.value.data.data : null,
          skills:
            skillsRes.status === "fulfilled" ? skillsRes.value.data.data : [],
          projects:
            projectsRes.status === "fulfilled"
              ? projectsRes.value.data.data
              : [],
          certificates:
            certsRes.status === "fulfilled" ? certsRes.value.data.data : [],
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
    <main className="min-h-screen w-full overflow-x-hidden overflow-y-auto">
      <Navbar />

      {loading ? (
        <div className="min-h-[80vh] flex items-center justify-center px-6 md:px-12">
          <div className="space-y-6 w-full max-w-sm md:max-w-xl lg:max-w-2xl">
            <SkeletonBlock className="h-8 w-32 md:w-48 mx-auto" />
            <SkeletonBlock className="h-24 md:h-32 w-full" />
            <SkeletonBlock className="h-6 w-4/5 md:w-3/4 mx-auto" />
            <SkeletonBlock className="h-12 w-40 md:w-56 mx-auto" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full">
          <HeroSection about={data.about} />
          <AboutSection about={data.about} />
          <SkillsSection skills={data.skills} />
          <ProjectsSection projects={data.projects} />
          <CertificatesSection certificates={data.certificates} />
          <ContactSection about={data.about} />
          <Footer about={data.about} />
        </div>
      )}
    </main>
  );
}
