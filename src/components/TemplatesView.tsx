import { useState } from 'react';
import { Scroll, Landmark, Shield, Rocket, Umbrella, Calendar, Plus } from 'lucide-react';
import { Task } from '@/types';

interface Template {
    id: string;
    category: 'DAO' | 'Engineering' | 'Growth';
    title: string;
    icon: React.ReactNode;
    description: string;
    tasks: Partial<Task>[];
}

const TEMPLATES: Template[] = [
    {
        id: '1',
        category: 'DAO',
        title: 'Proposal (SIP) Structure',
        icon: <Scroll size={24} className="text-purple-400" />,
        description: 'Standard template for submitting governance proposals.',
        tasks: [
            { content: 'Draft Proposal Title & Abstract', columnId: 'backlog', tags: ['Governance'] },
            { content: 'Define Motivation & Rationale', columnId: 'backlog', tags: ['Governance'] },
            { content: 'Specify Technical Implementation', columnId: 'backlog', tags: ['Dev'] },
            { content: 'Community Feedback Period', columnId: 'backlog', tags: ['Community'] },
        ]
    },
    {
        id: '2',
        category: 'DAO',
        title: 'Treasury Multisig Log',
        icon: <Landmark size={24} className="text-green-400" />,
        description: 'Track incoming/outgoing transactions and signer status.',
        tasks: [
            { content: 'Verify Signer Addresses', columnId: 'todo', tags: ['Finance'] },
            { content: 'Draft Transaction Payload', columnId: 'todo', tags: ['Finance'] },
            { content: 'Collect Signatures (3/5)', columnId: 'todo', tags: ['Finance', 'High Priority'] },
            { content: 'Execute Transaction', columnId: 'backlog', tags: ['Finance'] },
        ]
    },
    {
        id: '3',
        category: 'Engineering',
        title: 'Smart Contract Audit',
        icon: <Shield size={24} className="text-blue-400" />,
        description: 'Pre-launch security checklist and audit report storage.',
        tasks: [
            { content: 'Run Slither Analysis', columnId: 'todo', tags: ['Security'] },
            { content: 'Generate Test Coverage Report', columnId: 'todo', tags: ['Dev'] },
            { content: 'Submit to Audit Firm', columnId: 'backlog', tags: ['External'] },
            { content: 'Remediate Findings', columnId: 'backlog', tags: ['Dev', 'High Priority'] },
        ]
    },
    {
        id: '4',
        category: 'Engineering',
        title: 'Token Launch Roadmap',
        icon: <Rocket size={24} className="text-orange-400" />,
        description: 'Timeline view for Testnet, Audit, and TGE phases.',
        tasks: [
            { content: 'Deploy to Sepolia Testnet', columnId: 'done', tags: ['Dev'] },
            { content: 'Finalize Tokenomics', columnId: 'inprogress', tags: ['Product'] },
            { content: 'Schedule TGE Date', columnId: 'todo', tags: ['Marketing'] },
            { content: 'Setup Liquidity Pool', columnId: 'backlog', tags: ['DeFi'] },
        ]
    },
    {
        id: '5',
        category: 'Growth',
        title: 'Airdrop Whitelist',
        icon: <Umbrella size={24} className="text-pink-400" />,
        description: 'Table to manage wallet addresses and allocation amounts.',
        tasks: [
            { content: 'Define Eligibility Criteria', columnId: 'done', tags: ['Growth'] },
            { content: 'Snapshot Block Height', columnId: 'todo', tags: ['Dev'] },
            { content: 'Filter Sybil Attackers', columnId: 'backlog', tags: ['Security'] },
            { content: 'Publish Merkle Root', columnId: 'backlog', tags: ['Dev'] },
        ]
    },
    {
        id: '6',
        category: 'Growth',
        title: 'Content Calendar',
        icon: <Calendar size={24} className="text-yellow-400" />,
        description: 'Schedule tweets, AMAs, and community calls.',
        tasks: [
            { content: 'Draft Weekly Thread', columnId: 'todo', tags: ['Content'] },
            { content: 'Schedule Discord AMA', columnId: 'todo', tags: ['Community'] },
            { content: 'Prepare Monthly Update', columnId: 'backlog', tags: ['Content'] },
        ]
    },
];

interface TemplatesViewProps {
    onUseTemplate?: (tasks: Partial<Task>[]) => void;
}

export function TemplatesView({ onUseTemplate }: TemplatesViewProps) {
    const [activeCategory, setActiveCategory] = useState<'All' | 'DAO' | 'Engineering' | 'Growth'>('All');

    const filteredTemplates = activeCategory === 'All'
        ? TEMPLATES
        : TEMPLATES.filter(t => t.category === activeCategory);

    const handleUseTemplate = (template: Template) => {
        console.log(`Using template: ${template.title}`);
        if (onUseTemplate) {
            onUseTemplate(template.tasks);
        }
    };

    return (
        <div className="w-full p-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Template Library</h2>
                <p className="text-neutral-400">Accelerate your workflow with Web3-native setups.</p>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-4">
                {['All', 'DAO', 'Engineering', 'Growth'].map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === category
                            ? 'bg-white/10 text-white shadow-sm border border-white/10'
                            : 'text-neutral-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                    <div
                        key={template.id}
                        className="group relative p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm flex flex-col"
                    >
                        <div className="mb-4 p-3 rounded-lg bg-black/20 w-fit border border-white/5 group-hover:border-white/10 transition-colors">
                            {template.icon}
                        </div>

                        <div className="mb-1 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            {template.category}
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                            {template.title}
                        </h3>

                        <p className="text-sm text-neutral-400 mb-6 flex-1">
                            {template.description}
                        </p>

                        <button
                            onClick={() => handleUseTemplate(template)}
                            className="w-full py-2 rounded-lg bg-white/5 hover:bg-blue-500/20 text-neutral-300 hover:text-blue-300 border border-white/10 hover:border-blue-500/30 transition-all flex items-center justify-center gap-2 font-medium text-sm"
                        >
                            <Plus size={16} />
                            Use Template
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
