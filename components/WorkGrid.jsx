'use client';
import { useState } from 'react';
import ProjectCard from './ProjectCard';

const FILTERS = [['all', 'All'], ['store', 'E-commerce'], ['app', 'Web apps'], ['tool', 'Tools & AI'], ['design', 'Design & prototypes']];

export default function WorkGrid({ projects }) {
  const [f, setF] = useState('all');
  const list = f === 'all' ? projects : projects.filter((p) => p.cat === f);
  return (
    <>
      <div className="filters" role="group" aria-label="Filter projects">
        {FILTERS.map(([k, label]) => (
          <button key={k} type="button" aria-pressed={f === k} onClick={() => setF(k)}>{label}</button>
        ))}
      </div>
      <div className="pgrid">{list.map((p) => <ProjectCard key={p.slug} p={p} />)}</div>
    </>
  );
}
