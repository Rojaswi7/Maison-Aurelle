import Watch from './Watch';
import { TiltCard } from './Motion';
import { formatCHF, getDial, priceOf } from '../data/watch';

export default function ProductCard({ model, children }) {
  return (
    <TiltCard className="pcard">
      <div className="pcard__stage" style={{ '--glow': getDial(model.config.dialId).base }}>
        <Watch config={model.config} live={false} className="pcard__watch" label={`${model.name} watch`} />
      </div>
      <div className="pcard__meta">
        <div>
          <p className="pcard__cat">{model.category}</p>
          <h3 className="pcard__name">{model.name}</h3>
        </div>
        <p className="pcard__price">{formatCHF(priceOf(model.config))}</p>
      </div>
      {model.limited && <span className="pcard__badge">{model.limited}</span>}
      {children}
    </TiltCard>
  );
}
