import React from 'react';
import { Clock } from 'lucide-react';
import type { WorkflowStep } from '../../app/hooks/common/useLanding';
import homeHero from '../../assets/images/Homepage-BigHero-1200x500_2x.webp';

type WorkflowSectionProps = {
    workflowSteps: WorkflowStep[];
};

const WorkflowSection: React.FC<WorkflowSectionProps> = ({ workflowSteps }) => (
    <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Built for <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 bg-clip-text text-transparent">students and emerging teams</span>
                </h2>
                <p className="mt-4 max-w-2xl text-white/60">
                    Whether you are preparing for interviews, sprinting during a hackathon, or running campus study circles, KoodeCode adapts to your rituals.
                </p>
            </div>
            <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-black/40 p-8">
                    <div className="flex items-center space-x-4 text-white/60 text-sm uppercase tracking-[0.3em]">
                        <Clock size={16} />
                        <span>Plan · Pair · Iterate</span>
                    </div>
                    <img src={homeHero} alt="Team collaborating" className="mt-6 rounded-2xl border border-white/10" />
                </div>
                <div className="space-y-6">
                    {workflowSteps.map(step => (
                        <div key={step.title} className="flex items-start space-x-4 rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-emerald-400/40">
                            <div className="mt-1 rounded-2xl bg-gradient-to-br from-emerald-500/25 to-cyan-400/20 p-3 text-emerald-300">
                                <step.icon size={22} />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                                <p className="mt-2 text-sm text-white/65 leading-relaxed">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

export default WorkflowSection;

