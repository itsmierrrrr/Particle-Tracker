import { ImagePattern } from './ImagePattern'

const TEMPLATES = ['Brain', 'DNA', 'Saturn', 'Galaxy', 'Earth']

const COLOR_FIELDS = {
  Brain: [['main', 'BRAIN COLOR'], ['pulse', 'NEURAL PULSE COLOR']],
  DNA: [['strandOne', 'STRAND 1 COLOR'], ['strandTwo', 'STRAND 2 COLOR'], ['connector', 'CONNECTOR COLOR']],
  Saturn: [['planet', 'PLANET COLOR'], ['ring', 'RING COLOR']],
  Galaxy: [['core', 'CORE / CENTRE COLOR'], ['outer', 'OUTER GALAXY COLOR']],
  Earth: [['ocean', 'OCEAN COLOR'], ['land', 'LAND COLOR'], ['atmosphere', 'ATMOSPHERE COLOR']],
}

export function ParticleControls({ template, onTemplateChange, palette, onColorChange, onResetColors, minimized, onToggle, imageData, onImageLoad }) {
  if (minimized) return <button className="controls-launcher" onClick={onToggle} aria-label="Show particle controls">⚙</button>
  return (
    <aside className="particle-controls" aria-label="Particle controls">
      <header className="controls-header">
        <span>PARTICLE CONTROLS</span>
        <button className="controls-minimize" onClick={onToggle} aria-label="Minimize particle controls">-</button>
      </header>
      <section className="controls-section">
        <label className="controls-label">PARTICLE TEMPLATE</label>
        <div className="template-grid">
          {TEMPLATES.map((item) => <button key={item} className={template === item ? 'template-button active' : 'template-button'} onClick={() => onTemplateChange(item)}>{item}</button>)}
        </div>
      </section>
      <section className="controls-section color-section">
        <label className="controls-label">{template.toUpperCase()} COLORS</label>
        {COLOR_FIELDS[template].map(([key, label]) => <div className="color-row" key={key}><input id={`particle-${key}`} type="color" value={palette[key]} onChange={(event) => onColorChange(key, event.target.value)} /><span>{label}<small>{palette[key].toUpperCase()}</small></span></div>)}
        <button className="reset-color" onClick={onResetColors}>RESET COLORS</button>
      </section>
      <section className="controls-section">
        <ImagePattern onImageLoad={onImageLoad} isActive={Boolean(imageData)} />
      </section>
    </aside>
  )
}
