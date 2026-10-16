"use client";

import Link from "next/link";
import { useState } from "react";
import { Arrow } from "./SiteChrome";
import { careerRoles, careerTeams, hiringStages, getCareerTeam, getHiringStage } from "@/lib/careers/roles";
import styles from "@/app/(public)/careers/careers.module.css";

export default function CareersDirectory() {
  const [team, setTeam] = useState("all");
  const [stage, setStage] = useState("all");
  const [search, setSearch] = useState("");
  const filtered = careerRoles.filter(role => (team === "all" || role.team === team) && (stage === "all" || String(role.stage) === stage) && `${role.title} ${role.requirements.join(" ")} ${getCareerTeam(role.team).label}`.toLowerCase().includes(search.trim().toLowerCase())).sort((a, b) => a.stage - b.stage);
  return <div className={styles.directory}>
    <div className={styles.filters}><label>Search roles<input type="search" placeholder="Role, skill or product" value={search} onChange={event => { setSearch(event.target.value); }} /></label><label>Team<select value={team} onChange={event => { setTeam(event.target.value); }}><option value="all">All teams</option>{careerTeams.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label><label>Hiring phase<select value={stage} onChange={event => { setStage(event.target.value); }}><option value="all">All phases</option>{hiringStages.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label></div>
    <div className={styles.resultsHeading}><span role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? "role" : "roles"}</span><span>ROLE / TEAM / PHASE</span></div>
    <div className={styles.roleList}>{filtered.map(role => <Link href={`/careers/${role.slug}`} key={role.slug} className={styles.roleRow}><div><h3>{role.title}</h3><span>{role.level} · {role.type}</span></div><span className={styles.roleTeam}>{getCareerTeam(role.team).label}</span><span className={styles.rolePhase}>{getHiringStage(role.stage).label}</span><Arrow diagonal /></Link>)}</div>
    {!filtered.length && <div className={styles.empty}><p>No roles match these filters.</p><button type="button" onClick={() => { setTeam("all"); setStage("all"); setSearch(""); }}>Clear filters</button></div>}
    <div className={styles.directoryFoot}><p>Not seeing your role?</p><a href="#apply">Send an open application<Arrow diagonal /></a></div>
  </div>;
}
