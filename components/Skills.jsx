import Icon from './Icon';
import { skills } from '../lib/data';

export default function Skills() {
  return (
    <div className="skills">
      {skills.map((g) => (
        <div className="card skill-group" key={g.group}>
          <h3>{g.group}</h3>
          <ul>
            {g.items.map(([label, icon]) => (
              <li key={label}>
                <span className="ico">
                  {icon ? <img src={`/icons/${icon}.svg`} alt={`${label} logo`} width="26" height="26" loading="lazy" /> : <span style={{ color: '#5E8E3E' }}><Icon name="bag" size={24} /></span>}
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="card skill-group ai">
        <h3>AI</h3>
        <ul>
          {['OpenAI API', 'Claude API', 'Chatbots', 'Embeddings & RAG', 'Automation'].map((l) => (
            <li key={l}><span className="ico"><span style={{ color: '#7C3AED' }}><Icon name="ai" size={24} /></span></span>{l}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
