import { useState, useEffect } from 'react';
import { Scroll, Landmark, Shield, Rocket, Umbrella, Calendar, Plus, X, Save, Database } from 'lucide-react';
import { Task } from '@/types';
import { toast } from 'sonner';

interface Template {
    id: string;
    category: 'DAO' | 'Engineering' | 'Growth' | 'Custom';
    title: string;
    icon: React.ReactNode;
    description: string;
    tasks: Partial<Task>[];
    isCustom?: boolean;
}

const DEFAULT_TEMPLATES: Template[] = [
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
    onCreateWorkspace?: (name: string, tasks: Partial<Task>[]) => void;
}

export function TemplatesView({ onUseTemplate, onCreateWorkspace }: TemplatesViewProps) {
    const [activeCategory, setActiveCategory] = useState<'All' | 'DAO' | 'Engineering' | 'Growth' | 'Custom'>('All');
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isCreating, setIsCreating] = useState(false);

    // New Template State
    const [newTemplateTitle, setNewTemplateTitle] = useState('');
    const [newTemplateDesc, setNewTemplateDesc] = useState('');
    const [newTemplateTasks, setNewTemplateTasks] = useState<string>('');

    // Load templates from localStorage
    useEffect(() => {
        const savedCustomTemplates = localStorage.getItem('custom-templates');
        let customTemplates: Template[] = [];

        if (savedCustomTemplates) {
            try {
                customTemplates = JSON.parse(savedCustomTemplates);
                // Re-attach icons for custom templates (since React nodes don't serialize)
                customTemplates = customTemplates.map(t => ({
                    ...t,
                    icon: <Rocket size={24} className="text-white" /> // Default icon for custom templates
                }));
            } catch (e) {
                console.error('Failed to parse custom templates', e);
            }
        }

        setTemplates([...DEFAULT_TEMPLATES, ...customTemplates]);
    }, []);

    const handleCreateTemplate = () => {
        if (!newTemplateTitle || !newTemplateDesc) {
            toast.error('Please fill in title and description');
            return;
        }

        const tasksList = newTemplateTasks.split('\n').filter(t => t.trim()).map(content => ({
            content: content.trim(),
            columnId: 'backlog',
            tags: ['Custom']
        }));

        if (tasksList.length === 0) {
            toast.error('Please add at least one task');
            return;
        }

        const newTemplate: Template = {
            id: `custom-${Date.now()}`,
            category: 'Custom',
            title: newTemplateTitle,
            description: newTemplateDesc,
            icon: <Rocket size={24} className="text-white" />,
            isCustom: true,
            tasks: tasksList as Partial<Task>[]
        };

        const updatedTemplates = [...templates, newTemplate];
        setTemplates(updatedTemplates);

        // Save only custom templates to localStorage
        const customTemplates = updatedTemplates.filter(t => t.isCustom);
        // Remove icon property before saving as it contains React Node
        const templatesToSave = customTemplates.map(({ icon, ...rest }) => rest);
        localStorage.setItem('custom-templates', JSON.stringify(templatesToSave));

        setIsCreating(false);
        setNewTemplateTitle('');
        setNewTemplateDesc('');
        setNewTemplateTasks('');
        toast.success('Custom template created successfully!');
        setActiveCategory('Custom');
    };

    const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updatedTemplates = templates.filter(t => t.id !== id);
        setTemplates(updatedTemplates);

        const customTemplates = updatedTemplates.filter(t => t.isCustom);
        const templatesToSave = customTemplates.map(({ icon, ...rest }) => rest);
        localStorage.setItem('custom-templates', JSON.stringify(templatesToSave));
        toast.success('Template deleted');
    };

    const filteredTemplates = activeCategory === 'All'
        ? templates
        : templates.filter(t => t.category === activeCategory);

    const handleUseTemplate = (template: Template) => {
        console.log(`Using template: ${template.title}`);
        if (onUseTemplate) {
            onUseTemplate(template.tasks);
        }
    };

    const handleCreateWorkspace = (template: Template, e: React.MouseEvent) => {
        e.stopPropagation();
        const workspaceName = prompt('Enter workspace name:', template.title);
        if (workspaceName && workspaceName.trim() && onCreateWorkspace) {
            onCreateWorkspace(workspaceName.trim(), template.tasks);
            toast.success(`Workspace "${workspaceName}" created!`);
        }
    };

    return (
        <div className="w-full p-8 animate-in fade-in duration-500 relative">
            {/* Header */}
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Template Library</h2>
                    <p className="text-neutral-400">Accelerate your workflow with Web3-native setups.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all flex items-center gap-2"
                >
                    <Plus size={18} />
                    Create Template
                </button>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
                {['All', 'DAO', 'Engineering', 'Growth', 'Custom'].map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeCategory === category
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
                        {template.isCustom && (
                            <button
                                onClick={(e) => handleDeleteTemplate(template.id, e)}
                                className="absolute top-4 right-4 p-1.5 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"
                                title="Delete Template"
                            >
                                <X size={14} />
                            </button>
                        )}

                        <div className="mb-4 p-3 rounded-lg bg-black/20 w-fit border border-white/5 group-hover:border-white/10 transition-colors">
                            {template.icon}
                        </div>

                        <div className="mb-1 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            {template.category}
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                            {template.title}
                        </h3>

                        <p className="text-sm text-neutral-400 mb-6 flex-1 line-clamp-3">
                            {template.description}
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={(e) => handleCreateWorkspace(template, e)}
                                className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-purple-500/20 text-neutral-300 hover:text-purple-300 border border-white/10 hover:border-purple-500/30 transition-all flex items-center justify-center gap-2 font-medium text-sm"
                            >
                                <Database size={16} />
                                Create Workspace
                            </button>
                            <button
                                onClick={() => handleUseTemplate(template)}
                                className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-blue-500/20 text-neutral-300 hover:text-blue-300 border border-white/10 hover:border-blue-500/30 transition-all flex items-center justify-center gap-2 font-medium text-sm"
                            >
                                <Plus size={16} />
                                Use
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Template Modal */}
            {isCreating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-[#1a1b1e] border border-white/10 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Create Custom Template</h3>
                            <button
                                onClick={() => setIsCreating(false)}
                                className="text-neutral-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1 uppercase">Template Title</label>
                                <input
                                    type="text"
                                    value={newTemplateTitle}
                                    onChange={(e) => setNewTemplateTitle(e.target.value)}
                                    placeholder="e.g., Weekly Sprint Setup"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-500/50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1 uppercase">Description</label>
                                <textarea
                                    value={newTemplateDesc}
                                    onChange={(e) => setNewTemplateDesc(e.target.value)}
                                    placeholder="What is this template for?"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-500/50 resize-none h-20"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1 uppercase">Tasks (One per line)</label>
                                <textarea
                                    value={newTemplateTasks}
                                    onChange={(e) => setNewTemplateTasks(e.target.value)}
                                    placeholder="Review PRs&#10;Update Documentation&#10;Team Sync"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-500/50 resize-none h-32 font-mono text-sm"
                                />
                            </div>

                            <button
                                onClick={handleCreateTemplate}
                                className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all flex items-center justify-center gap-2 mt-2"
                            >
                                <Save size={18} />
                                Save Template
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
