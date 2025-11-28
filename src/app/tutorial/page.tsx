import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TutorialPage() {
    return (
        <main className="min-h-screen bg-white text-neutral-900 p-8 max-w-3xl m-auto">
            <Link href="/" className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-8 transition-colors">
                <ArrowLeft size={20} />
                Back to Board
            </Link>

            <h1 className="text-4xl font-bold mb-6">How to Use Your Kanban Board</h1>

            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold mb-3">1. Adding Tasks</h2>
                    <p className="text-neutral-600 leading-relaxed">
                        Simply click on the input field at the bottom of the <strong>"To Do"</strong> column.
                        Type your task description and press <kbd className="bg-neutral-100 px-2 py-1 rounded border border-neutral-300">Enter</kbd>.
                        Your new task will appear instantly.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">2. Organizing</h2>
                    <p className="text-neutral-600 leading-relaxed">
                        Drag and drop tasks between columns to update their status.
                        Move items from <strong>To Do</strong> → <strong>In Progress</strong> → <strong>Done</strong> as you work.
                        Everything is saved automatically to your browser, so you won't lose progress if you refresh.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">3. Syncing to Blockchain</h2>
                    <p className="text-neutral-600 leading-relaxed">
                        Want to make your achievements permanent?
                        <ol className="list-decimal list-inside mt-2 space-y-2 ml-4">
                            <li>Click the <strong>Connect Wallet</strong> button in the top right.</li>
                            <li>Once connected, a <strong>Sync to Blockchain 🔗</strong> button will appear.</li>
                            <li>Click it to save your "Done" tasks to the Arc Network forever.</li>
                        </ol>
                    </p>
                </section>
            </div>
        </main>
    );
}
