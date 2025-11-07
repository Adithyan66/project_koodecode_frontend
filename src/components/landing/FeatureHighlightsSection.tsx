import React from 'react';
import type { FeatureHighlight } from '../../app/hooks/common/useLanding';

type FeatureHighlightsSectionProps = {
    featureHighlights: FeatureHighlight[];
};

const FeatureHighlightsSection: React.FC<FeatureHighlightsSectionProps> = ({ featureHighlights }) => (
    <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 md:grid-cols-3">
                {featureHighlights.map(feature => (
                    <div key={feature.title} className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 via-white/2 to-transparent p-8 transition hover:-translate-y-1 hover:border-emerald-400/60">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-400/20 text-emerald-300">
                            <feature.icon size={26} />
                        </div>
                        <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white">{feature.title}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-white/65">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default FeatureHighlightsSection;

